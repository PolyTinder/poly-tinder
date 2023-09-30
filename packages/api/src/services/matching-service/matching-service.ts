import { Knex } from 'knex';
import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Match, Swipe } from 'common/models/matching';
import { UserAliasService } from '../user-alias-service/user-alias-service';
import { WsService } from '../ws-service/ws-service';

@singleton()
export class MatchingService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly userAliasService: UserAliasService,
        private readonly wsService: WsService,
    ) {}

    private get matches(): Knex.QueryBuilder<Match> {
        return this.databaseService.database<Match>('matches');
    }

    private get swipes(): Knex.QueryBuilder<Swipe> {
        return this.databaseService.database<Swipe>('swipes');
    }

    async swipeUser(
        activeUserId: number,
        targetUserId: number,
        liked: boolean,
    ): Promise<void> {
        // const targetUserId = await this.userAliasService.getUserId(
        //     targetUserAliasId,
        // );

        await this.swipes.insert({
            activeUserId,
            targetUserId,
            liked,
        });

        if (
            liked &&
            (await this.swipes
                .select()
                .where({
                    activeUserId: targetUserId,
                    targetUserId: activeUserId,
                    liked: true,
                })
                .first())
        ) {
            await this.matchUsers(activeUserId, targetUserId);
        }
    }

    async unmatchUser(userId: number, unmatchedUserId: number): Promise<void> {
        await this.matches
            .update({
                unmatched: true,
                unmatchedUserId,
                unmatchedTime: new Date(),
            })
            .where({
                user1Id: userId,
                user2Id: unmatchedUserId,
            })
            .orWhere({
                user1Id: unmatchedUserId,
                user2Id: userId,
            });
    }

    async areMatched(userId: number, targetUserId: number): Promise<boolean> {
        return !!(await this.matches
            .select()
            .where({
                user1Id: userId,
                user2Id: targetUserId,
                unmatched: false,
            })
            .orWhere({
                user1Id: targetUserId,
                user2Id: userId,
                unmatched: false,
            })
            .first());
    }

    private async matchUsers(user1Id: number, user2Id: number): Promise<void> {
        await this.matches.insert({
            user1Id,
            user2Id,
        });

        this.wsService.emitToUser(user1Id, 'match', { matchedUserId: user2Id });
    }
}
