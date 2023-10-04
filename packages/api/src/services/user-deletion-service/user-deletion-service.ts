import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { User, UserAlias, UserProfileDB, UserValidation } from 'common/models/user';
import { Message } from 'common/models/message';
import { Match, Swipe } from 'common/models/matching';

@singleton()
export class UserDeletionService {
    constructor(private readonly databaseService: DatabaseService) {}

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

    private get user(): Knex.QueryBuilder<User> {
        return this.databaseService.database<User>('users');
    }

    async deleteUser(userId: number, password: string): Promise<void> {}
}
