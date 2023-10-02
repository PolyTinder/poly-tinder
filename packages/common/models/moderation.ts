export interface Report {
    reportId: number;
    userId: number;
    reportedUserId: number;
    reportType: string;
    description?: string;
    timestamp: Date;
    reviewed:boolean;
}

export interface Block {
    blockId: number;
    userId: number;
    blockedUserId: number;
    timestamp: Date;
}