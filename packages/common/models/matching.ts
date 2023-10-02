import { NotLoadedPublicUserResult } from "./user";

export interface Swipe {
    activeUserId: number;
    targetUserId: number;
    liked: boolean;
    swipeTime: Date;
}

export interface Match {
    user1Id: number;
    user2Id: number;
    matchTime: Date;
    unmatched: boolean;
    unmatchedUserId?: number;
    unmatchedTime?: Date;
}

export interface MatchQueryInfo {
    messagesCount: number;
    unreadMessagesCount: number;
    lastMessage: string;
    lastMessageAuthorId: number;
    lastMessageTimestamp: Date;
}

export type PartialMatchQueryItem = Pick<Match, 'user1Id' | 'user2Id'> & {
    name1: string;
    name2: string;
};

export type MatchQueryItem = PartialMatchQueryItem & MatchQueryInfo;

export type MatchListItem = NotLoadedPublicUserResult & MatchQueryInfo;