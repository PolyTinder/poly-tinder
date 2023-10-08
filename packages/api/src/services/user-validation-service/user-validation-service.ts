import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { UserValidation } from 'common/models/user';
import { WsService } from '../ws-service/ws-service';
import { VerificationTokenService } from '../verification-token-service/verification-token-service';
import { EmailService } from '../email-service/email-service';
import { UserService } from '../user-service/user-service';
import { env } from '../../utils/environment';
import { HttpException } from '../../models/http-exception';
import { StatusCodes } from 'http-status-codes';

@singleton()
export class UserValidationService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly wsService: WsService,
        private readonly verificationTokenService: VerificationTokenService,
        private readonly emailService: EmailService,
        private readonly userService: UserService,
    ) {}

    private get userValidations(): Knex.QueryBuilder<UserValidation> {
        return this.databaseService.database<UserValidation>('userValidations');
    }

    async fetchValidation(userId: number): Promise<UserValidation> {
        const userValidation = await this.userValidations
            .select('*')
            .where({ userId })
            .first();

        if (!userValidation) {
            throw new Error('User validation not found');
        }

        return userValidation;
    }

    async createUserValidation(userId: number): Promise<void> {
        await this.userValidations.insert({ userId });
    }

    async isUserValid(userId: number): Promise<boolean> {
        try {
            const validation = await this.fetchValidation(userId);

            return validation.emailValidated && validation.userProfileReady;
        } catch {
            return false;
        }
    }

    async setUserProfileReady(
        userId: number,
        userProfileReady: boolean,
    ): Promise<void> {
        await this.userValidations
            .update({ userProfileReady })
            .where({ userId });

        const validation = await this.fetchValidation(userId);

        this.wsService.emitToUserIfConnected(
            userId,
            'user-validation:update',
            validation,
        );
    }

    async requestEmailValidation(userId: number): Promise<void> {
        const user = await this.userService.getUser(userId);
        const token = await this.verificationTokenService.generateToken(
            userId,
            'email',
        );

        const url = `${
            env.NODE_ENV === 'production'
                ? 'https://polytinder.com'
                : 'http://localhost:4200'
        }/verify-email?token=${encodeURIComponent(token)}`;

        const content = `
            <h1>PolyTinder</h1>
            <h2>Vérifiez votre email</h2>
            <p>Allez à cet URL <a href="${url}">${url}</a> pour vérifier votre email.</p>
        `;

        await this.emailService.sendEmail(
            user.email,
            'Vérifiez votre email',
            content,
        );
    }

    async validateEmail(userId: number, token: string): Promise<boolean> {
        await this.verificationTokenService.validateToken(
            userId,
            token,
            'email',
        );

        await this.userValidations
            .update({ emailValidated: true })
            .where({ userId });

        return true;
    }
}
