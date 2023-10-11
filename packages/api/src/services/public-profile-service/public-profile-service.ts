import { singleton } from 'tsyringe';
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

        const date = new Date();
        const seed = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

        const availableUsers: (NotLoadedPublicUserResult & {
            order?: number;
        })[] = await db
            .select([
                'targetUser.userId',
                'targetUserProfile.name',
                db.raw(`RAND(${seed}) as \`order\``),
            ])
            .fromRaw('(`users` as `targetUser`, `users` as `activeUser`)')
            .leftJoin('swipes', function () {
                this.on('targetUser.userId', '=', 'swipes.targetUserId').andOn(
                    'activeUser.userId',
                    '=',
                    'swipes.activeUserId',
                );
            })
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
            .innerJoin(
                'userValidations as activeUserValidations',
                'activeUser.userId',
                '=',
                'activeUserValidations.userId',
            )
            .innerJoin(
                'userValidations as targetUserValidations',
                'targetUser.userId',
                '=',
                'targetUserValidations.userId',
            )
            .leftJoin('blocks', function () {
                this.on(function () {
                    this.on(
                        'blocks.blockedUserEmail',
                        '=',
                        'targetUser.email',
                    ).andOn(
                        'blocks.blockingUserEmail',
                        '=',
                        'activeUser.email',
                    );
                }).orOn(function () {
                    this.on(
                        'blocks.blockedUserEmail',
                        '=',
                        'activeUser.email',
                    ).andOn(
                        'blocks.blockingUserEmail',
                        '=',
                        'targetUser.email',
                    );
                });
            })
            .leftJoin('banned', 'targetUser.email', '=', 'banned.email')
            .leftJoin('suspend', 'targetUser.email', '=', 'suspend.email')
            .where('targetUser.userId', '!=', userId)
            .andWhere('activeUser.userId', '=', userId)
            .andWhere('activeUserValidations.userProfileReady', '=', true)
            .andWhere('targetUserValidations.userProfileReady', '=', true)
            .andWhere('swipes.targetUserId', 'is', null)
            .andWhere('blocks.blockId', 'is', null)
            .andWhere('banned.email', 'is', null)
            .andWhere(function () {
                this.where('suspend.until', '<', db.raw('NOW()')).orWhere(
                    'suspend.until',
                    'is',
                    null,
                );
            })
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
            .groupBy('targetUser.userId')
            .orderBy('order')
            .limit(1000);

        return availableUsers.map((user) => {
            delete user.order;

            return user;
        });

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
            .innerJoin('users as u1', 'user1Id', '=', 'u1.userId')
            .innerJoin('users as u2', 'user2Id', '=', 'u2.userId')
            .leftJoin('blocks', function () {
                this.on(function () {
                    this.on('blocks.blockedUserEmail', '=', 'u1.email').andOn(
                        'blocks.blockingUserEmail',
                        '=',
                        'u2.email',
                    );
                }).orOn(function () {
                    this.on('blocks.blockedUserEmail', '=', 'u2.email').andOn(
                        'blocks.blockingUserEmail',
                        '=',
                        'u1.email',
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
            .andWhere('blocks.blockId', 'is', null);

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
