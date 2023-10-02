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
import { ModerationService } from '../moderation-service/moderation-service';
import { HttpException } from '../../models/http-exception';
import { StatusCodes } from 'http-status-codes';
import { create as createRandom } from 'random-seed';

@singleton()
export class PublicProfileService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly userProfileService: UserProfileService,
        private readonly userAliasService: UserAliasService,
        private readonly moderationService: ModerationService,
    ) {}

    private get users(): Knex.QueryBuilder<User> {
        return this.databaseService.database<User>('users');
    }

    private get matches(): Knex.QueryBuilder<Match> {
        return this.databaseService.database<Match>('matches');
    }

    async findUser(
        userId: TypeOfId<User>,
        requestingUserId: TypeOfId<User>,
    ): Promise<PublicUserResult> {
        if (await this.moderationService.isBlocked(requestingUserId, userId)) {
            throw new HttpException(
                'User profile not found',
                StatusCodes.NOT_FOUND,
            );
        }

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
        const db = this.databaseService.database;

        const availableUsers: { userId: number; name: string }[] = await db
            .select(['targetUser.userId', 'targetUserProfile.name'])
            .fromRaw('(`users` as `targetUser`, `users` as `activeUser`)')
            .leftJoin('swipes', function () {
                this.on('targetUser.userId', '=', 'swipes.targetUserId').andOn(
                    'activeUser.userId',
                    '=',
                    'swipes.activeUserId',
                );
            })
            .innerJoin(
                'userValidations',
                'targetUser.userId',
                '=',
                'userValidations.userId',
            )
            .innerJoin(
                'userProfiles as targetUserProfile',
                'targetUser.userId',
                '=',
                'targetUserProfile.userId',
            )
            .innerJoin(
                'userProfiles as activeUserProfile',
                'activeUser.userId',
                '=',
                'activeUserProfile.userId',
            )
            .leftJoin('blocks', function () {
                this.on(function () {
                    this.on(
                        'blocks.blockedUserId',
                        '=',
                        'targetUser.userId',
                    ).andOn('blocks.userId', '=', 'activeUser.userId');
                }).orOn(function () {
                    this.on(
                        'blocks.blockedUserId',
                        '=',
                        'activeUser.userId',
                    ).andOn('blocks.userId', '=', 'targetUser.userId');
                });
            })
            .where('targetUser.userId', '!=', userId)
            .andWhere('activeUser.userId', '=', userId)
            .andWhere('swipes.targetUserId', 'is', null)
            .andWhere('userValidations.userProfileReady', '=', true)
            .andWhere('userValidations.suspended', '=', false)
            .andWhere('userValidations.banned', '=', false)
            .andWhere('blocks.blockedUserId', 'is', null)
            .andWhere(function () {
                this.where('activeUserProfile.genderPreference', '=', 'all')
                    .orWhere('targetUserProfile.genderCategory', '=', 'other')
                    .orWhere(function () {
                        this.where(
                            'activeUserProfile.genderCategory',
                            '=',
                            db.ref('targetUserProfile.genderPreference'),
                        ).andWhere(
                            'targetUserProfile.genderCategory',
                            '=',
                            db.ref('activeUserProfile.genderPreference'),
                        );
                    })
                    .orWhere(function () {
                        this.where(
                            'targetUserProfile.genderCategory',
                            '=',
                            db.ref('activeUserProfile.genderPreference'),
                        ).andWhere(
                            'activeUserProfile.genderCategory',
                            '=',
                            'other',
                        );
                    })
                    .orWhere(function () {
                        this.where(
                            'targetUserProfile.genderCategory',
                            '=',
                            db.ref('activeUserProfile.genderPreference'),
                        ).andWhere(
                            'activeUserProfile.genderPreference',
                            '=',
                            'all',
                        );
                    });
            })
            .limit(1000);

        const size = availableUsers.length;

        const results: { userId: number; name: string }[] = [];

        const date = new Date();
        const rand = createRandom(
            `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        );

        for (let i = 0; i < Math.min(MATCHING_BATCH_SIZE, size); ++i) {
            results.push(popRandom(availableUsers, rand));
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
            .leftJoin('blocks', function () {
                this.on(function () {
                    this.on('blocks.blockedUserId', '=', 'user1Id').andOn(
                        'blocks.userId',
                        '=',
                        'user2Id',
                    );
                }).orOn(function () {
                    this.on('blocks.blockedUserId', '=', 'user2Id').andOn(
                        'blocks.userId',
                        '=',
                        'user1Id',
                    );
                });
            })
            .where(function () {
                this.where({
                    user1Id: userId,
                    unmatched: false,
                }).orWhere({
                    user2Id: userId,
                    unmatched: false,
                });
            })
            .andWhere('blocks.blockedUserId', '!=', userId);

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
                lastMessageTimestamp: match.lastMessageTimestamp,
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
                this.databaseService
                    .database<Message>('messages')
                    .select('timestamp')
                    .where(this.whereMessagesFromMatch(match))
                    .orderBy('timestamp', 'desc')
                    .limit(1)
                    .as('lastMessageTimestamp'),
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
