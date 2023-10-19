import { User, UserProfile } from "./user";

export interface Admin {
    adminId: number;
    userId: number;
}

export type UserListItem = Pick<User, 'userId' | 'email' | 'createdAt' | 'updatedAt'> & Pick<UserProfile, 'name' | 'age' | 'pictures'> & {
    lastLogin: Date;
    isBanned?: boolean;
    isSuspended?: boolean;
    reportCount: number;
    profileUpdatedAt?: Date;
};