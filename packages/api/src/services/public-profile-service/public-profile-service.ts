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
import { Match } from 'common/models/matching';

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

    async findUser(userAliasId: string): Promise<PublicUserResult> {
        const userId = await this.userAliasService.getUserId(userAliasId);
        const userProfile = await this.userProfileService.getUserProfile(
            userId,
        );
        const newUserAliasId = await this.userAliasService.createAlias(userId);

        return { userAliasId: newUserAliasId, ...userProfile };
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

        return Promise.all(
            results.map<Promise<NotLoadedPublicUserResult>>(async (user) => ({
                userAliasId: await this.userAliasService.createAlias(
                    user.userId,
                ),
                name: user.name,
            })),
        );
    }

    async getMatches(
        userId: TypeOfId<User>,
    ): Promise<NotLoadedPublicUserResult[]> {
        const matches: (Pick<Match, 'user1Id' | 'user2Id'> & {
            name1?: string;
            name2?: string;
        })[] = await this.matches
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

        const results: { id: number; name: string }[] = [];

        for (const match of matches) {
            results.push(
                match.user1Id === userId
                    ? {
                          id: match.user2Id,
                          name: match.name2 ?? '',
                      }
                    : {
                          id: match.user1Id,
                          name: match.name1 ?? '',
                      },
            );
        }

        return Promise.all(
            results.map(async (user) => ({
                userAliasId: await this.userAliasService.createAlias(user.id),
                name: user.name,
            })),
        );
    }
}
