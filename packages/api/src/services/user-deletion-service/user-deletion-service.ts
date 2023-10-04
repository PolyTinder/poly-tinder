import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import {
    User,
    UserAlias,
    UserProfileDB,
    UserValidation,
} from 'common/models/user';
import { Message } from 'common/models/message';
import { Match, Swipe } from 'common/models/matching';
import { UserService } from '../user-service/user-service';
import { AuthenticationService } from '../authentication-service/authentication-service';
import { HttpException } from '../../models/http-exception';
import { StatusCodes } from 'http-status-codes';
import { WsService } from '../ws-service/ws-service';
import { Session } from 'inspector';
import { UserSavedSession } from 'common/models/authentication';

@singleton()
export class UserDeletionService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly userService: UserService,
        private readonly authenticationService: AuthenticationService,
        private readonly wsService: WsService,
    ) {}

    private get userProfiles(): Knex.QueryBuilder<UserProfileDB> {
        return this.databaseService.database<UserProfileDB>('userProfiles');
    }

    private get matches(): Knex.QueryBuilder<Match> {
        return this.databaseService.database<Match>('matches');
    }

    private get swipes(): Knex.QueryBuilder<Swipe> {
        return this.databaseService.database<Swipe>('swipes');
    }

    private get messages(): Knex.QueryBuilder<Message> {
        return this.databaseService.database('messages');
    }

    private get userAliases(): Knex.QueryBuilder<UserAlias> {
        return this.databaseService.database<UserAlias>('userAliases');
    }

    private get userValidations(): Knex.QueryBuilder<UserValidation> {
        return this.databaseService.database<UserValidation>('userValidations');
    }

    private get sessions(): Knex.QueryBuilder<UserSavedSession> {
        return this.databaseService.database('sessions');
    }

    private get user(): Knex.QueryBuilder<User> {
        return this.databaseService.database<User>('users');
    }

    async deleteUser(userId: number, password: string): Promise<void> {
        const user = await this.userService.getUser(userId);

        if (
            !(await this.authenticationService.comparePassword(
                password,
                user.hash,
            ))
        ) {
            throw new HttpException('Invalid password', StatusCodes.FORBIDDEN);
        }

        const affectedUsers: Pick<Match, 'user1Id' | 'user2Id'>[] =
            await this.matches
                .select(['user1Id', 'user2Id'])
                .where({ user1Id: userId })
                .orWhere({ user2Id: userId });

        await Promise.all([
            this.userProfiles.where({ userId }).del(),
            this.matches
                .where({ user1Id: userId })
                .orWhere({ user2Id: userId })
                .del(),
            this.swipes
                .where({ activeUserId: userId })
                .orWhere({ targetUserId: userId })
                .del(),
            this.messages
                .where({ senderId: userId })
                .orWhere({ recipientId: userId })
                .del(),
            this.userAliases.where({ userId }).del(),
            this.userValidations.where({ userId }).del(),
            this.sessions.where({ userId }).del(),
        ]);

        await this.user.where({ userId }).del();

        for (const affectedUser of affectedUsers) {
            const affectedUserId =
                affectedUser.user1Id === userId
                    ? affectedUser.user2Id
                    : affectedUser.user1Id;

            this.wsService.emitToUserIfConnected(
                affectedUserId,
                'match:update-list',
                {},
            );
        }
    }
}
