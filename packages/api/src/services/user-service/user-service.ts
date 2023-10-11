import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { User } from 'common/models/user';
import { Knex } from 'knex';
import { HttpException } from '../../models/http-exception';
import { StatusCodes } from 'http-status-codes';

@singleton()
export class UserService {
    constructor(private readonly databaseService: DatabaseService) {}

    private get user(): Knex.QueryBuilder<User> {
        return this.databaseService.database<User>('users');
    }

    /**
     * Get a user by their ID
     *
     * @param userId ID of the user to get
     * @returns The user
     */
    async getUser(userId: number): Promise<User> {
        const user = await this.user.select('*').where({ userId }).first();

        if (!user) {
            throw new HttpException('User not found', StatusCodes.NOT_FOUND);
        }

        return user;
    }
}
