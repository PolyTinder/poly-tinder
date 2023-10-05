import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { Admin } from 'common/models/admin';
import { Report } from 'common/models/moderation';

@singleton()
export class AdminService {
    constructor(private readonly databaseService: DatabaseService) {}

    private get admin(): Knex.QueryBuilder<Admin> {
        return this.databaseService.database('admin');
    }

    private get reports(): Knex.QueryBuilder<Report> {
        return this.databaseService.database('reports');
    }

    async isAdmin(userId: number): Promise<boolean> {
        const admin = await this.admin.where({ userId }).first();

        return !!admin;
    }

    async getReports(): Promise<Report[]> {
        return this.reports
            .select([
                'reports.*',
                'reportingUser.userId as reportingUserId',
                'reportedUser.userId as reportedUserId',
            ])
            .leftJoin(
                'users as reportingUser',
                'reports.reportingUserEmail',
                'reportingUser.email',
            )
            .leftJoin(
                'users as reportedUser',
                'reports.reportedUserEmail',
                'reportedUser.email',
            )
            .orderBy('created_at', 'desc');
    }
}
