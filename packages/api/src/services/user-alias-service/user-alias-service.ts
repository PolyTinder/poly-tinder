import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { User, UserAlias } from 'common/models/user';
import { TypeOfId } from 'common/types/id';
import { v4 as uuidv4 } from 'uuid';
import { USER_ALIAS_EXPIRATION } from '../../constants/user';
import { HttpException } from '../../models/http-exception';

@singleton()
export class UserAliasService {
    constructor(private readonly databaseService: DatabaseService) {}

    private get userAliases(): Knex.QueryBuilder<UserAlias> {
        return this.databaseService.database<UserAlias>('userAliases');
    }

    /**
     * Create a new user alias
     *
     * @param userId ID of the user to create an alias for
     * @returns The user alias ID
     */
    async createAlias(userId: TypeOfId<User>): Promise<string> {
        const userAliasId = uuidv4();
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + USER_ALIAS_EXPIRATION);

        await this.userAliases.insert({ userAliasId, userId, expiration });

        return userAliasId;
    }

    /**
     * Get the user ID for a user alias
     *
     * @param userAliasId ID of the user alias
     * @returns The user ID
     */
    async getUserId(userAliasId: string): Promise<TypeOfId<User>> {
        const userAlias = await this.userAliases
            .select()
            .where({ userAliasId })
            .first();

        if (!userAlias) {
            throw new HttpException('User alias not found');
        }

        if (userAlias.expiration < new Date()) {
            throw new HttpException('User alias expired');
        }

        await this.userAliases.delete().where({ userAliasId });

        return userAlias.userId;
    }
}
