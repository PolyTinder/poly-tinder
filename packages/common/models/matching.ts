export interface Swipe {
    activeUserId: number;
    targetUserId: number;
    liked: boolean;
    swipeTime: Date;
}

export interface Match {
    userId1: number;
    userId2: number;
    matchTime: Date;
    unmatched: boolean;
    unmatchedUserId?: number;
    unmatchedTime?: Date;
}
