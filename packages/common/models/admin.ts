import { User, UserProfile } from "./user";

export interface Admin {
    adminId: number;
    userId: number;
}

export type UserListItem = Pick<User, 'userId' | 'email'> & Pick<UserProfile, 'name' | 'age'> & {
    lastLogin: Date;
};