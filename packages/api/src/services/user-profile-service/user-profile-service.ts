import { Knex } from 'knex';
import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { User, UserProfile, UserProfileDB } from 'common/models/user';
import { NoId, TypeOfId } from 'common/types/id';

@singleton()
export class UserProfileService {
    constructor(private readonly databaserService: DatabaseService) {}

    private get userProfiles(): Knex.QueryBuilder<UserProfileDB> {
        return this.databaserService.database<UserProfileDB>('userProfiles');
    }

    async getUserProfile(userId: TypeOfId<User>): Promise<NoId<UserProfile>> {
        const res =
            (await this.userProfiles.select().where({ userId }).first()) ?? {};
        delete res.userId;

        return this.fromUserProfileDB(res);
    }

    async setUserProfile(
        userId: TypeOfId<User>,
        userProfile: UserProfile,
    ): Promise<void> {
        const converted = this.toUserProfileDB(userProfile);
        const update: {
            [K in keyof Omit<UserProfileDB, 'userId'>]: UserProfileDB[K] | null;
        } = {
            name: converted.name ?? null,
            age: converted.age ?? null,
            bio: converted.bio ?? null,
            picture1: converted.picture1 ?? null,
            picture2: converted.picture2 ?? null,
            picture3: converted.picture3 ?? null,
            picture4: converted.picture4 ?? null,
            picture5: converted.picture5 ?? null,
            picture6: converted.picture6 ?? null,
            interests: converted.interests ?? null,
            associations: converted.associations ?? null,
            program: converted.program ?? null,
            educationLevel: converted.educationLevel ?? null,
            height: converted.height ?? null,
            lookingFor: converted.lookingFor ?? null,
            relationshipType: converted.relationshipType ?? null,
            languages: converted.languages ?? null,
            zodiacSign: converted.zodiacSign ?? null,
            drinking: converted.drinking ?? null,
            smoking: converted.smoking ?? null,
            drugs: converted.drugs ?? null,
            workout: converted.workout ?? null,
            jobTitle: converted.jobTitle ?? null,
            jobCompany: converted.jobCompany ?? null,
            livingIn: converted.livingIn ?? null,
            gender: converted.gender ?? null,
            genderCategory: converted.genderCategory ?? null,
            genderPreference: converted.genderPreference ?? null,
            sexualOrientation: converted.sexualOrientation ?? null,
        };

        if (await this.userProfiles.select().where({ userId }).first()) {
            await this.userProfiles
                .update(update as UserProfileDB)
                .where({ userId });
        } else {
            await this.userProfiles.insert({
                ...(update as UserProfileDB),
                userId,
            });
        }
    }

    private async setUserProfilePictures(
        userId: TypeOfId<User>,
        pictures: string[],
    ): Promise<void> {
        await this.userProfiles
            .update({
                picture1: pictures[0],
                picture2: pictures[1],
                picture3: pictures[2],
                picture4: pictures[3],
                picture5: pictures[4],
                picture6: pictures[5],
            })
            .where({ userId });
    }

    private async setUserProfileInterests(
        userId: TypeOfId<User>,
        interests: string[],
    ): Promise<void> {
        await this.userProfiles
            .update({
                interests:
                    interests.length > 0 ? interests.join(',') : undefined,
            })
            .where({ userId });
    }

    private async setUserProfileAssociations(
        userId: TypeOfId<User>,
        associations: string[],
    ): Promise<void> {
        await this.userProfiles
            .update({
                associations:
                    associations.length > 0
                        ? associations.join(',')
                        : undefined,
            })
            .where({ userId });
    }

    private async setUserProfileLanguages(
        userId: TypeOfId<User>,
        languages: string[],
    ): Promise<void> {
        await this.userProfiles
            .update({
                languages:
                    languages.length > 0 ? languages.join(',') : undefined,
            })
            .where({ userId });
    }

    private toUserProfileDB(userProfile: UserProfile): UserProfileDB {
        return {
            ...userProfile,
            picture1: userProfile.pictures?.[0],
            picture2: userProfile.pictures?.[1],
            picture3: userProfile.pictures?.[2],
            picture4: userProfile.pictures?.[3],
            picture5: userProfile.pictures?.[4],
            picture6: userProfile.pictures?.[5],
            interests: userProfile.interests?.join(','),
            associations: userProfile.associations?.join(','),
            languages: userProfile.languages?.join(','),
        };
    }

    private fromUserProfileDB(userProfile: UserProfileDB): UserProfile {
        const res = {
            ...userProfile,
            pictures: [
                userProfile.picture1,
                userProfile.picture2,
                userProfile.picture3,
                userProfile.picture4,
                userProfile.picture5,
                userProfile.picture6,
            ].filter((picture): picture is string => !!picture),
            interests: userProfile.interests?.split(',') ?? [],
            associations: userProfile.associations?.split(',') ?? [],
            languages: userProfile.languages?.split(',') ?? [],
        };

        delete res.picture1;
        delete res.picture2;
        delete res.picture3;
        delete res.picture4;
        delete res.picture5;
        delete res.picture6;

        return res;
    }
}
