export interface User {
    userId: number;
    email: string;
    hash: string;
    salt: string;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type GenderCategory = 'man' | 'woman' | 'other';
export type GenderPreference = 'man' | 'woman' | 'all';

export interface UserProfile {
    userId: number;
    name?: string;
    age?: number;
    bio?: string;
    pictures?: string[];
    interests?: string[];
    associations?: string[];
    program?: string;
    educationLevel?: string;
    height?: number;
    lookingFor?: string;
    relationshipType?: string;
    languages?: string[];
    zodiacSign?: string;
    drinking?: string;
    smoking?: string;
    drugs?: string;
    workout?: string;
    jobTitle?: string;
    jobCompany?: string;
    livingIn?: string;
    gender?: string;
    genderCategory?: 'men' | 'women' | 'other';
    genderPreference?: 'men' | 'women' | 'all';
    sexualOrientation?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UnsafeUserProfileAttributes = 'pictures' | 'interests' | 'associations' | 'languages';

export interface UserProfileDB extends Omit<UserProfile, UnsafeUserProfileAttributes> {
    picture1?: string;
    picture2?: string;
    picture3?: string;
    picture4?: string;
    picture5?: string;
    picture6?: string;
    interests?: string;
    associations?: string;
    languages?: string;
}

export type PublicUser = Pick<User, 'email' | 'userId'>;

export interface UserValidation {
    userId: number;
    emailValidated: boolean;
    userProfileReady: boolean;
}

export type UserValidationResponse = Pick<UserValidation, 'userProfileReady' | 'emailValidated'>;

export interface UserAlias {
    userAliasId: string;
    userId: number;
    expiration: Date;
}

// export type NotLoadedPublicUserResult = Pick<UserProfile, 'name'> & { userAliasId: string };

// export type PublicUserResult = Omit<UserProfile, 'userId'> & { userAliasId: string };

export type NotLoadedPublicUserResult = Pick<UserProfile, 'name' | 'userId'>;

export type PublicUserResult = UserProfile;