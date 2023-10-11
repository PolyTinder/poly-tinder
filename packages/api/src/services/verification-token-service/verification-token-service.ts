import { singleton } from 'tsyringe';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../database-service/database-service';
import { VerificationToken } from 'common/models/verification-token';
import { HttpException } from '../../models/http-exception';
import { StatusCodes } from 'http-status-codes';

@singleton()
export class VerificationTokenService {
    constructor(private readonly databaseService: DatabaseService) {}

    private get verificationTokens() {
        return this.databaseService.database<VerificationToken>(
            'verificationTokens',
        );
    }

    /**
     * Generate a token for a user
     *
     * @param userId ID of the user to generate a token for
     * @param tokenType Type of token to generate
     * @returns The generated token
     */
    async generateToken(userId: number, tokenType: string): Promise<string> {
        const tokenKey = uuid();
        const token = jwt
            .sign({ userId }, tokenKey, { expiresIn: 900 })
            .toString();

        await this.verificationTokens.insert({
            token,
            tokenType,
            tokenKey,
        });

        return token;
    }

    /**
     * Validate a token
     *
     * @param userId ID of the user to validate the token for
     * @param token Token to validate
     * @param tokenType Type of token to validate
     * @returns The user ID
     */
    async validateToken(
        userId: number | undefined,
        token: string,
        tokenType: string,
    ): Promise<number> {
        const verificationToken = await this.verificationTokens
            .where({ token, tokenType, isUsed: false })
            .first();

        if (!verificationToken) {
            throw new HttpException('Token not found', StatusCodes.NOT_FOUND);
        }

        const { verificationTokenId, tokenKey } = verificationToken;

        await this.verificationTokens
            .update({ isUsed: true })
            .where({ verificationTokenId });

        const { userId: tokenUserId } = jwt.verify(token, tokenKey) as {
            userId: number;
        };

        if (userId && userId !== tokenUserId) {
            throw new HttpException(
                'Token does not match user',
                StatusCodes.BAD_REQUEST,
            );
        }

        return tokenUserId;
    }
}
