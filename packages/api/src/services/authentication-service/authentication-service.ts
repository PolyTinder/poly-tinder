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
import { UserProfileService } from '../user-profile-service/user-profile-service';
import { UserValidationService } from '../user-validation-service/user-validation-service';
import { WsService } from '../ws-service/ws-service';
import { Socket } from 'socket.io';
import { ModerationService } from '../moderation-service/moderation-service';
import { AdminService } from '../admin-service/admin-service';
import { VerificationTokenService } from '../verification-token-service/verification-token-service';
import { EmailService } from '../email-service/email-service';
import { normaliseEmail } from '../../utils/email';

@singleton()
export class AuthenticationService {
    constructor(
        private readonly databaserService: DatabaseService,
        private readonly userProfileService: UserProfileService,
        private readonly userValidationService: UserValidationService,
        private readonly wsService: WsService,
        private readonly moderationService: ModerationService,
        private readonly adminService: AdminService,
        private readonly verificationTokenService: VerificationTokenService,
        private readonly emailService: EmailService,
    ) {
        this.wsService.registerAuthenticationValidation(
            this.validateSocket.bind(this),
        );
    }

    private get users(): Knex.QueryBuilder<User> {
        return this.databaserService.database<User>('users');
    }

    private get sessions(): Knex.QueryBuilder<UserSavedSession> {
        return this.databaserService.database<UserSavedSession>('sessions');
    }

    /**
     * Signup a user
     *
     * @param user Authentication information
     * @returns The user and a token
     */
    async signup(user: AuthenticationUser): Promise<UserPublicSession> {
        const email = normaliseEmail(user.email);

        if (await this.getUserByEmail(email)) {
            throw new HttpException(
                'User already exists',
                StatusCodes.CONFLICT,
            );
        }

        if (await this.moderationService.isEmailBannedOrSuspended(email)) {
            throw new HttpException(
                'Cannot create account',
                StatusCodes.LOCKED,
            );
        }

        const newUser: NoId<Omit<User, 'createdAt' | 'updatedAt'>> = {
            email,
            lastLogin: new Date(),
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

        await this.userProfileService.initUserProfile(createdUser.userId);
        await this.userValidationService.createUserValidation(
            createdUser.userId,
        );

        const session = await this.createSession(createdUser.userId);
        const token = this.generateToken(createdUser.userId, session.sessionId);

        await this.userValidationService.requestEmailValidation(
            createdUser.userId,
        );

        return {
            user: {
                userId: createdUser.userId,
                email: createdUser.email,
            },
            token,
        };
    }

    /**
     * Login a user
     *
     * @param user Authentication information
     * @param admin Whether or not the user is an admin (for login in the admin panel)
     * @returns The user and a token
     */
    async login(
        user: AuthenticationUser,
        admin = false,
    ): Promise<UserPublicSession> {
        const email = normaliseEmail(user.email);
        const foundUser = await this.getUserByEmail(email);

        if (!foundUser) {
            throw new HttpException(
                'Email or password incorrect',
                StatusCodes.NOT_ACCEPTABLE,
            );
        }

        if (await this.moderationService.isEmailBannedOrSuspended(email)) {
            throw new HttpException('Cannot login', StatusCodes.LOCKED);
        }

        if (admin && !(await this.adminService.isAdmin(foundUser.userId))) {
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

        await this.updateLastLogin(foundUser.userId);

        return {
            user: {
                userId: foundUser.userId,
                email: foundUser.email,
            },
            token,
        };
    }

    /**
     * Create session from token and refreshes it
     *
     * @param token Token to load the session from
     * @param admin Whether or not the user is an admin (for login in the admin panel)
     * @returns The user and a token
     */
    async loadSession(
        token: string,
        admin = false,
    ): Promise<UserPublicSession> {
        const { userId, sessionId } = jwt.verify(token, env.JWT_SECRET) as {
            userId: TypeOfId<User>;
            sessionId: TypeOfId<UserSavedSession>;
        };

        const session = await this.getSession(userId, sessionId);

        if (!session) {
            throw new HttpException('Session not found', StatusCodes.LOCKED);
        }

        const user = await this.users.select().where({ userId }).first();

        if (await this.moderationService.isEmailBannedOrSuspended(user.email)) {
            throw new HttpException('Cannot login', StatusCodes.BAD_REQUEST);
        }

        if (!user) {
            throw new HttpException(
                'User not found',
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }

        if (admin && !(await this.adminService.isAdmin(user.userId))) {
            throw new HttpException('Unauthorized', StatusCodes.UNAUTHORIZED);
        }

        const newToken = this.generateToken(user.userId, session.sessionId);

        await this.updateLastLogin(user.userId);

        return {
            user: {
                userId: user.userId,
                email: user.email,
            },
            token: newToken,
        };
    }

    /**
     * Logout a user
     *
     * @param token Active token of the user
     */
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

    /**
     * Logout all sessions of a user
     *
     * @param token Active token of the user
     */
    async logoutAll(token: string): Promise<void> {
        const { userId } = jwt.verify(token, env.JWT_SECRET) as {
            userId: TypeOfId<User>;
            sessionId: TypeOfId<UserSavedSession>;
        };

        await this.sessions.delete().where({ userId });
    }

    /**
     * Creates a password reset request and send an email to the user
     *
     * @param email Email of the user to reset the password for
     */
    async requestPasswordReset(email: string): Promise<void> {
        email = normaliseEmail(email);
        const user = await this.getUserByEmail(email);

        if (!user) {
            throw new HttpException('User not found', StatusCodes.NOT_FOUND);
        }

        const token = await this.verificationTokenService.generateToken(
            user.userId,
            'password-reset',
        );

        const url = `${
            env.NODE_ENV === 'production'
                ? 'https://polytinder.com'
                : 'http://localhost:4200'
        }/password-reset?token=${encodeURIComponent(token)}`;

        const content = `
            <h1>PolyTinder</h1>
            <h2>Réinitialiser votre mot de passe</h2>
            <p>Allez à cet URL <a href="${url}">${url}</a> réinitialiser votre mot de passe.</p>
        `;

        await this.emailService.sendEmail(
            user.email,
            'Réinitialiser votre mot de passe',
            content,
        );
    }

    /**
     * Reset the password of a user
     *
     * @param token Token to validate the password reset request
     * @param password New password
     */
    async resetPassword(token: string, password: string): Promise<void> {
        const userId = await this.verificationTokenService.validateToken(
            undefined,
            token,
            'password-reset',
        );

        const user = await this.users.select().where({ userId }).first();

        if (!user) {
            throw new HttpException('User not found', StatusCodes.NOT_FOUND);
        }

        const { hash, salt } = await this.hashPassword(password);

        await this.users
            .update({ hash, salt })
            .where({ userId })
            .catch(() => {
                throw new HttpException(
                    'Password not updated',
                    StatusCodes.INTERNAL_SERVER_ERROR,
                );
            });
    }

    /**
     * Compare a password with a hash
     *
     * @param password Password in plain text
     * @param hash Hash to compare the password with
     * @returns Whether or not the password matches the hash
     */
    async comparePassword(password: string, hash: string): Promise<boolean> {
        if (password.length === 0 && hash.length === 0) return true;
        return await bcrypt.compare(password, hash);
    }

    private async getSession(
        userId: TypeOfId<User>,
        sessionId: TypeOfId<UserSavedSession>,
    ): Promise<UserSavedSession | undefined> {
        return this.sessions.select().where({ userId, sessionId }).first();
    }

    private async updateLastLogin(userId: TypeOfId<User>): Promise<void> {
        await this.users.update({ lastLogin: new Date() }).where({ userId });
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

    private generateToken(
        userId: TypeOfId<User>,
        sessionId: TypeOfId<UserSavedSession>,
    ): string {
        return jwt.sign({ userId, sessionId }, env.JWT_SECRET);
    }

    private async validateSocket(token: string, socket: Socket): Promise<void> {
        await this.loadSession(token).then((session) => {
            if (!session) {
                return socket.disconnect();
            }

            this.wsService.connectClient(session.user.userId, socket.id);

            socket.on('disconnect', () => {
                this.wsService.disconnectSocket(socket.id);
            });
        });
    }
}
