import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Report, Block } from 'common/models/moderation';
import { WsService } from '../ws-service/ws-service';

@singleton()
export class ModerationService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly wsService: WsService,
    ) {}

    private get reports() {
        return this.databaseService.database<Report>('reports');
    }

    private get blocks() {
        return this.databaseService.database<Block>('blocks');
    }

    async reportUser(report: Report): Promise<void> {
        await this.reports.insert(report);
    }

    async blockUser(block: Block): Promise<void> {
        await this.blocks.insert(block);
        this.wsService.emitToUserIfConnected(
            block.blockedUserId,
            'match:update-list',
            {},
        );
    }

    async isBlocked(userId: number, targetUserId: number): Promise<boolean> {
        const block = await this.blocks
            .select()
            .where({ userId, blockedUserId: targetUserId })
            .first();

        return !!block;
    }
}
