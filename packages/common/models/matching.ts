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
