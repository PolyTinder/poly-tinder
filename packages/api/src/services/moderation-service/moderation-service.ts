import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import {
    Report,
    Block,
    ReportRequest,
    BlockRequest,
    Ban,
    Suspend,
} from 'common/models/moderation';
import { WsService } from '../ws-service/ws-service';
import { UserService } from '../user-service/user-service';
import { normaliseEmail, removeEmailModifier } from '../../utils/email';

@singleton()
export class ModerationService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly wsService: WsService,
        private readonly userService: UserService,
    ) {}

    private get reports() {
        return this.databaseService.database<Report>('reports');
    }

    private get blocks() {
        return this.databaseService.database<Block>('blocks');
    }

    private get banned() {
        return this.databaseService.database<Ban>('banned');
    }

    private get suspended() {
        return this.databaseService.database<Suspend>('suspend');
    }

    async reportUser(request: ReportRequest): Promise<void> {
        const [reportingUser, reportedUser] = await Promise.all([
            this.userService.getUser(request.reportingUserId),
            this.userService.getUser(request.reportedUserId),
        ]);

        await this.reports.insert({
            reportedUserEmail: removeEmailModifier(reportedUser.email),
            reportingUserEmail: removeEmailModifier(reportingUser.email),
            reportType: request.reportType,
            description: request.description,
        });
    }

    async blockUser(request: BlockRequest): Promise<void> {
        const [blockingUser, blockedUser] = await Promise.all([
            this.userService.getUser(request.blockingUserId),
            this.userService.getUser(request.blockedUserId),
        ]);

        await this.blocks.insert({
            blockingUserEmail: removeEmailModifier(blockingUser.email),
            blockedUserEmail: removeEmailModifier(blockedUser.email),
        });

        this.wsService.emitToUserIfConnected(
            request.blockedUserId,
            'match:update-list',
            {},
        );
    }

    async banUser(userId: number, reason?: string): Promise<void> {
        const user = await this.userService.getUser(userId);

        await this.banned.insert({
            email: removeEmailModifier(user.email),
            reason,
        });
    }

    async suspendUser(
        userId: number,
        until: Date,
        reason?: string,
    ): Promise<void> {
        const user = await this.userService.getUser(userId);

        await this.suspended.insert({
            email: removeEmailModifier(user.email),
            until,
            reason,
        });
    }

    async isBlocked(userId: number, targetUserId: number): Promise<boolean> {
        const [user, targetUser] = await Promise.all([
            this.userService.getUser(userId),
            this.userService.getUser(targetUserId),
        ]);

        const block = await this.blocks
            .select()
            .where({
                blockingUserEmail: removeEmailModifier(user.email),
                blockedUserEmail: removeEmailModifier(targetUser.email),
            })
            .first();

        return !!block;
    }

    async isBannedOrSuspended(userId: number): Promise<boolean> {
        const user = await this.userService.getUser(userId);

        return this.isEmailBannedOrSuspended(removeEmailModifier(user.email));
    }

    async isEmailBannedOrSuspended(email: string): Promise<boolean> {
        email = removeEmailModifier(normaliseEmail(email));

        console.log('check email', email);

        const [ban, suspends] = await Promise.all([
            this.banned.select('*').where({ email }).first(),
            this.suspended.select('*').where({ email }),
        ]);

        return (
            !!ban ||
            suspends.some((suspend) => new Date(suspend.until) > new Date())
        );
    }
}
