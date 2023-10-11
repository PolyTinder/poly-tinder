import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { Report } from 'common/models/moderation';

@singleton()
export class AdminReportsService {
    constructor(private readonly databaseService: DatabaseService) {}

    private get reports(): Knex.QueryBuilder<Report> {
        return this.databaseService.database('reports');
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
