import { singleton } from 'tsyringe';
import { MATCHING_BATCH_SIZE } from '../../constants/matching';
import { popRandom } from '../../utils/random';
import { TypeOfId } from 'common/types/id';
import { PublicUserResult, User } from 'common/models/user';
import { UserProfileService } from '../user-profile-service/user-profile-service';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { UserAliasService } from '../user-alias-service/user-alias-service';

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

    async findUser(userAliasId: string): Promise<PublicUserResult> {
        const userId = await this.userAliasService.getUserId(userAliasId);
        const userProfile = await this.userProfileService.getUserProfile(
            userId,
        );
        const newUserAliasId = await this.userAliasService.createAlias(userId);

        return { userAliasId: newUserAliasId, ...userProfile };
    }

    async getAvailableUsers(userId: TypeOfId<User>): Promise<string[]> {
        const userProfile = await this.userProfileService.getUserProfile(
            userId,
        );

        const availableUsers = await this.users
            .select('user.userId')
            .leftJoin('swipes', 'user.userId', '=', 'swipes.activeUserId')
            .innerJoin(
                'userValidations',
                'user.userId',
                '=',
                'userValidations.userId',
            )
            .innerJoin(
                'userProfiles',
                'user.userId',
                '=',
                'userProfiles.userId',
            )
            .where('user.userId', '!=', userId)
            .andWhere('swipes.activeUserId', 'is', null)
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

        const results: number[] = [];

        for (let i = 0; i < MATCHING_BATCH_SIZE; ++i) {
            results.push(popRandom(availableUsers));
        }

        return Promise.all(
            results.map((id) => this.userAliasService.createAlias(id)),
        );
    }
}
