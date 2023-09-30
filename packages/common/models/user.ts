export interface User {
    userId: number;
    email: string;
    hash: string;
    salt: string;
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

export type PublicUser = Omit<User, 'hash' | 'salt'>;

export interface UserValidation {
    userId: number;
    emailValidated: boolean;
    userProfileReady: boolean;
    suspended: boolean;
    suspensionReason?: string;
    banned: boolean;
}

export interface UserAlias {
    userAliasId: string;
    userId: number;
    expiration: Date;
}

export type NotLoadedPublicUserResult = Pick<UserProfile, 'name'> & { userAliasId: string };

export type PublicUserResult = Omit<UserProfile, 'userId'> & { userAliasId: string };