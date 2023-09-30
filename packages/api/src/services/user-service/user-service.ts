import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { UserValidation } from 'common/models/user';
import { Knex } from 'knex';

@singleton()
export class UserService {
    constructor(private readonly databaseService: DatabaseService) {}

    private get userValidations(): Knex.QueryBuilder<UserValidation> {
        return this.databaseService.database<UserValidation>('users');
    }

    async isUserValid(userId: number): Promise<boolean> {
        const userValidation = await this.userValidations
            .select('*')
            .where({ userId })
            .first();

        if (!userValidation) {
            return false;
        }

        return (
            userValidation.userProfileReady &&
            !userValidation.suspended &&
            !userValidation.banned
        );
    }

    async setUserProfileReady(
        userId: number,
        userProfileReady: boolean,
    ): Promise<void> {
        await this.userValidations
            .update({ userProfileReady })
            .where({ userId });
    }
}
