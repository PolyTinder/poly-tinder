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

    /**
     * Report a user
     *
     * @param request Report request
     */
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

    /**
     * Block a user
     *
     * @param request Block request
     */
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

    /**
     * Check if two users are blocked
     *
     * @param userId ID of the first user
     * @param targetUserId ID of the second user
     * @returns Whether or not the users are blocked
     */
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
            .orWhere({
                blockingUserEmail: removeEmailModifier(targetUser.email),
                blockedUserEmail: removeEmailModifier(user.email),
            })
            .first();

        return !!block;
    }

    /**
     * Get if a user is banned or suspended
     *
     * @param userId ID of the user to check
     * @returns Whether or not the user is banned or suspended
     */
    async isBannedOrSuspended(userId: number): Promise<boolean> {
        const user = await this.userService.getUser(userId);

        return this.isEmailBannedOrSuspended(removeEmailModifier(user.email));
    }

    /**
     * Get if an email is banned or suspended
     *
     * @param email Email to check
     * @returns Whether or not the email is banned or suspended
     */
    async isEmailBannedOrSuspended(email: string): Promise<boolean> {
        email = removeEmailModifier(normaliseEmail(email));

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
