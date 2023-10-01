import { singleton } from 'tsyringe';
import { MATCHING_BATCH_SIZE } from '../../constants/matching';
import { popRandom } from '../../utils/random';
import { TypeOfId } from 'common/types/id';
import {
    NotLoadedPublicUserResult,
    PublicUserResult,
    User,
} from 'common/models/user';
import { UserProfileService } from '../user-profile-service/user-profile-service';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { UserAliasService } from '../user-alias-service/user-alias-service';
import {
    Match,
    MatchListItem,
    MatchQueryInfo,
    MatchQueryItem,
    PartialMatchQueryItem,
} from 'common/models/matching';
import { Message } from 'common/models/message';

@singleton()
export class PublicProfileService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly userProfileService: UserProfileService,
        private readonly userAliasService: UserAliasService,
    ) {}

    private get users(): Knex.QueryBuilder<User> {
        return this.databaseService.database<User>('users');
    }

    private get matches(): Knex.QueryBuilder<Match> {
        return this.databaseService.database<Match>('matches');
    }

    async findUser(userId: TypeOfId<User>): Promise<PublicUserResult> {
        // const userId = await this.userAliasService.getUserId(userAliasId);
        const userProfile = await this.userProfileService.getUserProfile(
            userId,
        );
        // const newUserAliasId = await this.userAliasService.createAlias(userId);

        return { ...userProfile, userId };
    }

    async getAvailableUsers(
        userId: TypeOfId<User>,
    ): Promise<NotLoadedPublicUserResult[]> {
        const userProfile = await this.userProfileService.getUserProfile(
            userId,
        );

        const availableUsers: { userId: number; name: string }[] =
            await this.users
                .select(
                    'users.userId',
                    'userProfiles.name',
                    'swipes.activeUserId',
                )
                .leftJoin('swipes', 'users.userId', '=', 'swipes.targetUserId')
                .innerJoin(
                    'userValidations',
                    'users.userId',
                    '=',
                    'userValidations.userId',
                )
                .innerJoin(
                    'userProfiles',
                    'users.userId',
                    '=',
                    'userProfiles.userId',
                )
                .where('users.userId', '!=', userId)
                .whereNotIn(
                    'users.userId',
                    this.users
                        .select('userId')
                        .leftJoin(
                            'swipes',
                            'users.userId',
                            '=',
                            'swipes.targetUserId',
                        )
                        .where('swipes.activeUserId', '=', userId),
                )
                .andWhere('userValidations.userProfileReady', '=', true)
                .andWhere('userValidations.suspended', '=', false)
                .andWhere('userValidations.banned', '=', false)
                .andWhere(function () {
                    if (userProfile.genderPreference === 'all') return;

                    this.where(
                        'userProfiles.genderCategory',
                        '=',
                        userProfile.genderPreference ?? '',
                    ).orWhere('userProfiles.genderCategory', '=', 'other');
                })
                .andWhere(function () {
                    if (userProfile.genderCategory === 'other') return;

                    this.where(
                        'userProfiles.genderPreference',
                        '=',
                        userProfile.genderCategory ?? '',
                    ).orWhere('userProfiles.genderPreference', '=', 'all');
                })
                .limit(1000);

        const size = availableUsers.length;

        const results: { userId: number; name: string }[] = [];

        for (let i = 0; i < Math.min(MATCHING_BATCH_SIZE, size); ++i) {
            results.push(popRandom(availableUsers));
        }

        return results;

        // return Promise.all(
        //     results.map<Promise<NotLoadedPublicUserResult>>(async (user) => ({
        //         userAliasId: await this.userAliasService.createAlias(
        //             user.userId,
        //         ),
        //         name: user.name,
        //     })),
        // );
    }

    async getMatches(
        userId: TypeOfId<User>,
    ): Promise<NotLoadedPublicUserResult[]> {
        const matches: PartialMatchQueryItem[] = await this.matches
            .select(
                'user1Id',
                'user2Id',
                'up1.name as name1',
                'up2.name as name2',
            )
            .leftJoin('userProfiles as up1', 'user1Id', '=', 'up1.userId')
            .leftJoin('userProfiles as up2', 'user2Id', '=', 'up2.userId')
            .where({
                user1Id: userId,
                unmatched: false,
            })
            .orWhere({
                user2Id: userId,
                unmatched: false,
            });

        const completedMatches: MatchQueryItem[] = await Promise.all(
            matches.map(async (match) => ({
                ...match,
                ...(await this.fetchMatchQueryInfo(match, userId)),
            })),
        );

        const results: MatchListItem[] = [];

        for (const match of completedMatches) {
            results.push({
                ...(match.user1Id === userId
                    ? {
                          userId: match.user2Id,
                          name: match.name2 ?? '',
                      }
                    : {
                          userId: match.user1Id,
                          name: match.name1 ?? '',
                      }),
                messagesCount: match.messagesCount,
                unreadMessagesCount: match.unreadMessagesCount,
                lastMessage: match.lastMessage,
                lastMessageAuthorId: match.lastMessageAuthorId,
            });
        }

        return results;
    }

    private async fetchMatchQueryInfo(
        match: PartialMatchQueryItem,
        currentUserId: number,
    ): Promise<MatchQueryInfo> {
        return this.databaseService.database
            .select(
                this.databaseService
                    .database<Message>('messages')
                    .count()
                    .where(this.whereMessagesFromMatch(match))
                    .as('messagesCount'),
                this.databaseService
                    .database<Message>('messages')
                    .count()
                    .where({ read: false, recipientId: currentUserId })
                    .andWhere(this.whereMessagesFromMatch(match))
                    .as('unreadMessagesCount'),
                this.databaseService
                    .database<Message>('messages')
                    .select('content')
                    .where(this.whereMessagesFromMatch(match))
                    .orderBy('timestamp', 'desc')
                    .limit(1)
                    .as('lastMessage'),
                this.databaseService
                    .database<Message>('messages')
                    .select('senderId')
                    .where(this.whereMessagesFromMatch(match))
                    .orderBy('timestamp', 'desc')
                    .limit(1)
                    .as('lastMessageAuthorId'),
            )
            .first();
    }

    private whereMessagesFromMatch(match: PartialMatchQueryItem) {
        return function (this: Knex.QueryBuilder<Message>) {
            this.where(function () {
                this.where({
                    senderId: match.user1Id,
                }).andWhere({
                    recipientId: match.user2Id,
                });
            }).orWhere(function () {
                this.where({
                    senderId: match.user2Id,
                }).andWhere({
                    recipientId: match.user1Id,
                });
            });
        };
    }
}
