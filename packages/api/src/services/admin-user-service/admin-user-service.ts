import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { User } from 'common/models/user';
import { UserListItem } from 'common/models/admin';
import { Ban, Report, Suspend } from 'common/models/moderation';
import { UserService } from '../user-service/user-service';
import { EmailService } from '../email-service/email-service';

@singleton()
export class AdminUserService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly userService: UserService,
        private readonly emailService: EmailService,
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

        return (
            await this.users
                .select([
                    'users.userId',
                    'users.email',
                    'users.lastLogin',
                    'users.createdAt',
                    'users.updatedAt',
                    'userProfiles.name',
                    'userProfiles.age',
                    'userProfiles.picture1',
                    'userProfiles.picture2',
                    'userProfiles.picture3',
                    'userProfiles.picture4',
                    'userProfiles.picture5',
                    'userProfiles.picture6',
                    'userProfiles.updatedAt as profileUpdatedAt',
                    db.raw('COUNT(DISTINCT `banned`.`bannedId`) as `isBanned`'),
                    db.raw(
                        'CASE WHEN MAX(`suspend`.`until`) > NOW() THEN 1 ELSE NULL END as `isSuspended`',
                    ),
                    db.raw(
                        'COUNT(DISTINCT `suspend`.`suspendId`) as `suspensionCount`',
                    ),
                    db.raw(
                        'COUNT(DISTINCT `reports`.`reportId`) as `reportCount`',
                    ),
                ])
                .leftJoin('userProfiles', 'users.userId', 'userProfiles.userId')
                .leftJoin('banned', 'users.email', 'banned.email')
                .leftJoin('suspend', 'users.email', 'suspend.email')
                .leftJoin('reports', 'users.email', 'reports.reportedUserEmail')
                .groupBy('users.userId')
        ).map(
            (
                user: UserListItem & {
                    picture1?: string;
                    picture2?: string;
                    picture3?: string;
                    picture4?: string;
                    picture5?: string;
                    picture6?: string;
                },
            ) => {
                user.pictures = [
                    user.picture1,
                    user.picture2,
                    user.picture3,
                    user.picture4,
                    user.picture5,
                    user.picture6,
                ].filter((picture): picture is string => picture !== null);

                delete user.picture1;
                delete user.picture2;
                delete user.picture3;
                delete user.picture4;
                delete user.picture5;
                delete user.picture6;

                return user;
            },
        );
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
        sendEmail = false,
    ): Promise<void> {
        const user = await this.userService.getUser(userId);
        await this.suspend.insert({
            email: user.email,
            until,
            reason,
        });
        if (sendEmail) {
            await this.emailService.sendEmail(
                user.email,
                'Avis de suspension sur PolyTinder',
                `Votre compte a été suspendu jusqu'au ${until.toLocaleDateString()} sur l'application PolyTinder.<br><br><b>Raison</b>: ${reason}<br><br>Après la période de suspension, vous aurez à nouveau accès à votre compte pour vous permettre de remédier à la situation.<br><br>Pour plus d'information sur les règlements, rendez vous à <a href='https://polytinder.com/about'>https://polytinder.com/about</a>.<br><br><br>Merci de votre compréhension,<br><br>L'équipe PolyTinder`,
            );
        }
    }

    /**
     * Ban a user
     *
     * @param userId ID of the user to ban
     * @param reason Reason for the ban
     */
    async banUser(
        userId: number,
        reason: string,
        sendEmail = false,
    ): Promise<void> {
        const user = await this.userService.getUser(userId);
        await this.ban.insert({
            email: user.email,
            reason,
        });
        if (sendEmail) {
            await this.emailService.sendEmail(
                user.email,
                'Avis de bannissement sur PolyTinder',
                `Votre compte a été banni sur l'application PolyTinder.<br><br><b>Raison</b>: ${reason}<br><br>Pour plus d'information sur les règlements, rendez vous à <a href='https://polytinder.com/about'>https://polytinder.com/about</a>.<br><br><br>Merci de votre compréhension,<br><br>L'équipe PolyTinder`,
            );
        }
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
