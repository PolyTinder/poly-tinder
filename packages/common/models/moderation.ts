
export interface Report {
    reportId: number;
    reportingUserEmail: string;
    reportedUserEmail: string;
    reportType: string;
    description?: string;
    timestamp: Date;
    reviewed:boolean;
}

export type ReportRequest = Pick<Report, 'reportType' | 'description'> & {
    reportingUserId: number;
    reportedUserId: number;
}

export interface Block {
    blockId: number;
    blockingUserEmail: string;
    blockedUserEmail: string;
    timestamp: Date;
}

export interface BlockRequest {
    blockingUserId: number;
    blockedUserId: number;
}

export interface Ban {
    bannedId: number;
    email: string;
    reason?: string;
    timestamp: Date;
}

export interface Suspend {
    suspendId: number;
    email: string;
    reason?: string;
    until: Date;
    timestamp: Date;
}