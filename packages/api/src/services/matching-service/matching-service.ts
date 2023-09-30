import { Knex } from 'knex';
import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Match, Swipe } from 'common/models/matching';
import { UserAliasService } from '../user-alias-service/user-alias-service';

@singleton()
export class MatchingService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly userAliasService: UserAliasService,
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

    private async matchUsers(user1Id: number, user2Id: number): Promise<void> {
        await this.matches.insert({
            user1Id,
            user2Id,
        });
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
}
