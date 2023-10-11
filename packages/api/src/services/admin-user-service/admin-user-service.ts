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

    /**
     * Get all users
     *
     * @returns All users in the database
     */
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

    /**
     * Get all suspensions for a user
     *
     * @param userId ID of the user to get suspensions for
     * @returns All suspensions for the user
     */
    async getSuspensionsForUser(userId: number): Promise<Suspend[]> {
        const user = await this.userService.getUser(userId);
        return this.suspend
            .where({ email: user.email })
            .orderBy('until', 'desc');
    }

    /**
     * Get all bans for a user
     *
     * @param userId ID of the user to get bans for
     * @returns All bans for the user
     */
    async getBanForUser(userId: number): Promise<Ban | undefined> {
        const user = await this.userService.getUser(userId);
        return this.ban.where({ email: user.email }).first();
    }

    /**
     * Get all reports for a user
     *
     * @param userId ID of the user to get reports for
     * @returns All reports for the user
     */
    async getReportsForUser(userId: number): Promise<Report[]> {
        const user = await this.userService.getUser(userId);
        return this.reports
            .where({ reportedUserEmail: user.email })
            .orderBy('created_at', 'desc');
    }

    /**
     * Suspend a user
     *
     * @param userId ID of the user to suspend
     * @param until Date the suspension ends
     * @param reason Reason for the suspension
     */
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

    /**
     * Ban a user
     *
     * @param userId ID of the user to ban
     * @param reason Reason for the ban
     */
    async banUser(userId: number, reason: string): Promise<void> {
        const user = await this.userService.getUser(userId);
        await this.ban.insert({
            email: user.email,
            reason,
        });
    }

    /**
     * Revoke a user's suspension. This sets all active suspensions expiration to now, effectively revoking them but keeping a record of it.
     *
     * @param userId ID of the user to revoke the suspension for
     */
    async revokeSuspension(userId: number): Promise<void> {
        const user = await this.userService.getUser(userId);
        await this.suspend
            .update({ until: new Date() })
            .where({ email: user.email })
            .andWhere('until', '>', new Date());
    }

    /**
     * Unban a user
     *
     * @param userId ID of the user to unban
     */
    async unbanUser(userId: number): Promise<void> {
        const user = await this.userService.getUser(userId);
        await this.ban.where({ email: user.email }).delete();
    }
}
