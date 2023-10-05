import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { User } from 'common/models/user';
import { UserListItem } from 'common/models/admin';

@singleton()
export class AdminUserService {
    constructor(private readonly databaseService: DatabaseService) {}

    private get users(): Knex.QueryBuilder<User> {
        return this.databaseService.database('users');
    }

    async listUsers(): Promise<UserListItem[]> {
        return this.users
            .select([
                'users.userId',
                'users.email',
                'users.lastLogin',
                'userProfiles.name',
                'userProfiles.age',
            ])
            .leftJoin('userProfiles', 'users.userId', 'userProfiles.userId');
    }
}
