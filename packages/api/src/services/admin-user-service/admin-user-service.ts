import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { User } from 'common/models/user';
import { UserListItem } from 'common/models/admin';
import { Ban, Report, Suspend } from 'common/models/moderation';
import { UserService } from '../user-service/user-service';

@singleton()
export class AdminUserService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly userService: UserService,
    ) {}

    private get users(): Knex.QueryBuilder<User> {
        return this.databaseService.database('users');
    }

    private get suspend(): Knex.QueryBuilder<Suspend> {
        return this.databaseService.database('suspend');
    }

    private get ban(): Knex.QueryBuilder<Ban> {
        return this.databaseService.database('banned');
    }

    private get reports(): Knex.QueryBuilder<Report> {
        return this.databaseService.database('reports');
    }

    async listUsers(): Promise<UserListItem[]> {
        const db = this.databaseService.database;

        return this.users
            .select([
                'users.userId',
                'users.email',
                'users.lastLogin',
                'userProfiles.name',
                'userProfiles.age',
                db.raw('COUNT(DISTINCT `banned`.`bannedId`) as `isBanned`'),
                db.raw(
                    'CASE WHEN MAX(`suspend`.`until`) > NOW() THEN 1 ELSE NULL END as `isSuspended`',
                ),
                db.raw(
                    'COUNT(DISTINCT `suspend`.`suspendId`) as `suspensionCount`',
                ),
                db.raw('COUNT(DISTINCT `reports`.`reportId`) as `reportCount`'),
            ])
            .leftJoin('userProfiles', 'users.userId', 'userProfiles.userId')
            .leftJoin('banned', 'users.email', 'banned.email')
            .leftJoin('suspend', 'users.email', 'suspend.email')
            .leftJoin('reports', 'users.email', 'reports.reportedUserEmail')
            .groupBy('users.userId');
    }

    async getSuspensionsForUser(userId: number): Promise<Suspend[]> {
        const user = await this.userService.getUser(userId);
        return this.suspend
            .where({ email: user.email })
            .orderBy('until', 'desc');
    }

    async getBanForUser(userId: number): Promise<Ban | undefined> {
        const user = await this.userService.getUser(userId);
        return this.ban.where({ email: user.email }).first();
    }

    async getReportsForUser(userId: number): Promise<Report[]> {
        const user = await this.userService.getUser(userId);
        return this.reports
            .where({ reportedUserEmail: user.email })
            .orderBy('created_at', 'desc');
    }

    async suspendUser(
        userId: number,
        until: Date,
        reason: string,
    ): Promise<void> {
        const user = await this.userService.getUser(userId);
        await this.suspend.insert({
            email: user.email,
            until,
            reason,
        });
    }

    async banUser(userId: number, reason: string): Promise<void> {
        const user = await this.userService.getUser(userId);
        await this.ban.insert({
            email: user.email,
            reason,
        });
    }

    async revokeSuspension(userId: number): Promise<void> {
        const user = await this.userService.getUser(userId);
        await this.suspend
            .update({ until: new Date() })
            .where({ email: user.email })
            .andWhere('until', '>', new Date());
    }

    async unbanUser(userId: number): Promise<void> {
        const user = await this.userService.getUser(userId);
        await this.ban.where({ email: user.email }).delete();
    }
}
