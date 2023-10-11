import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { Admin } from 'common/models/admin';

@singleton()
export class AdminService {
    constructor(private readonly databaseService: DatabaseService) {}

    private get admin(): Knex.QueryBuilder<Admin> {
        return this.databaseService.database('admin');
    }

    /**
     * Check if a user is an admin
     *
     * @param userId ID of the user to check
     * @returns Whether or not the user is an admin
     */
    async isAdmin(userId: number): Promise<boolean> {
        const admin = await this.admin.where({ userId }).first();

        return !!admin;
    }
}
