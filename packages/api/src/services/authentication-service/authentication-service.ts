import { singleton } from 'tsyringe';
import {
    AuthenticationUser,
    UserSavedSession,
    UserPublicSession,
} from 'common/models/authentication';
import { User } from 'common/models/user';
import { NoId, TypeOfId } from 'common/types/id';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { HttpException } from '../../models/http-exception';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../utils/environment';

@singleton()
export class AuthenticationService {
    constructor(private readonly databaserService: DatabaseService) {}

    private get users(): Knex.QueryBuilder<User> {
        return this.databaserService.database<User>('users');
    }

    private get sessions(): Knex.QueryBuilder<UserSavedSession> {
        return this.databaserService.database<UserSavedSession>('sessions');
    }

    async signup(user: AuthenticationUser): Promise<UserPublicSession> {
        if (await this.getUserByEmail(user.email)) {
            throw new HttpException(
                'User already exists',
                StatusCodes.CONFLICT,
            );
        }

        const newUser: NoId<User> = {
            email: user.email,
            ...(await this.hashPassword(user.password)),
        };

        const [userId] = await this.users.insert(newUser);

        const createdUser = await this.users.select().where({ userId }).first();

        if (!createdUser) {
            throw new HttpException(
                'User not created',
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }

        const session = await this.createSession(createdUser.userId);
        const token = this.generateToken(createdUser.userId, session.sessionId);

        return {
            user: {
                userId: createdUser.userId,
                email: createdUser.email,
            },
            token,
        };
    }

    async login(user: AuthenticationUser): Promise<UserPublicSession> {
        const foundUser = await this.getUserByEmail(user.email);

        if (!foundUser) {
            throw new HttpException(
                'Email or password incorrect',
                StatusCodes.NOT_ACCEPTABLE,
            );
        }

        if (!(await this.comparePassword(user.password, foundUser.hash))) {
            throw new HttpException(
                'Email or password incorrect',
                StatusCodes.NOT_ACCEPTABLE,
            );
        }

        const session = await this.createSession(foundUser.userId);
        const token = this.generateToken(foundUser.userId, session.sessionId);

        return {
            user: {
                userId: foundUser.userId,
                email: foundUser.email,
            },
            token,
        };
    }

    async loadSession(token: string): Promise<UserPublicSession> {
        const { userId, sessionId } = jwt.verify(token, env.JWT_SECRET) as {
            userId: TypeOfId<User>;
            sessionId: TypeOfId<UserSavedSession>;
        };

        const session = await this.getSession(userId, sessionId);

        if (!session) {
            throw new HttpException(
                'Session not found',
                StatusCodes.UNAUTHORIZED,
            );
        }

        const user = await this.users.select().where({ userId }).first();

        if (!user) {
            throw new HttpException(
                'User not found',
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            user: {
                userId: user.userId,
                email: user.email,
            },
            token,
        };
    }

    async logout(token: string): Promise<void> {
        const { userId, sessionId } = jwt.verify(token, env.JWT_SECRET) as {
            userId: TypeOfId<User>;
            sessionId: TypeOfId<UserSavedSession>;
        };

        const session = await this.getSession(userId, sessionId);

        if (!session) {
            throw new HttpException(
                'Session not found',
                StatusCodes.UNAUTHORIZED,
            );
        }

        await this.sessions.delete().where({ userId, sessionId });
    }

    async logoutAll(token: string): Promise<void> {
        const { userId } = jwt.verify(token, env.JWT_SECRET) as {
            userId: TypeOfId<User>;
            sessionId: TypeOfId<UserSavedSession>;
        };

        await this.sessions.delete().where({ userId });
    }

    private async getSession(
        userId: TypeOfId<User>,
        sessionId: TypeOfId<UserSavedSession>,
    ): Promise<UserSavedSession | undefined> {
        return this.sessions.select().where({ userId, sessionId }).first();
    }

    private async createSession(
        userId: TypeOfId<User>,
    ): Promise<UserSavedSession> {
        const [sessionId] = await this.sessions.insert({ userId });
        return this.sessions.select().where({ sessionId, userId }).first();
    }

    private async getUserByEmail(email: string): Promise<User | undefined> {
        return this.users.select().where({ email }).first();
    }

    private async hashPassword(
        password: string,
    ): Promise<Pick<User, 'hash' | 'salt'>> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        return { salt, hash };
    }

    private async comparePassword(
        password: string,
        hash: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    private generateToken(
        userId: TypeOfId<User>,
        sessionId: TypeOfId<UserSavedSession>,
    ): string {
        return jwt.sign({ userId, sessionId }, env.JWT_SECRET);
    }
}
