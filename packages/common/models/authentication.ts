import { PublicUser, User } from "./user";

export type AuthenticationUser = Pick<User, 'email'> & { password: string };

export interface UserSavedSession {
    sessionId: number;
    userId: number;
    description: string | undefined;
    createdAt: Date;
}

export interface Token {
    token: string;
}

export interface UserPublicSession extends Token {
    user: PublicUser;
}