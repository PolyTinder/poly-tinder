export interface VerificationToken {
    verificationTokenId: number;
    token: string;
    tokenKey: string;
    tokenType: string;
    isUsed: boolean;
    created_at: Date;
}