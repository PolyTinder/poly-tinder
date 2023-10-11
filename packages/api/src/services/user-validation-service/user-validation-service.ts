import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { UserValidation } from 'common/models/user';
import { WsService } from '../ws-service/ws-service';
import { VerificationTokenService } from '../verification-token-service/verification-token-service';
import { EmailService } from '../email-service/email-service';
import { UserService } from '../user-service/user-service';
import { env } from '../../utils/environment';

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

    /**
     * Get the validation status of a user
     *
     * @param userId ID of the user to get the validation status of
     * @returns Get all validation status of a user
     */
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

    /**
     * Create a validation entry for a user
     *
     * @param userId ID of the user to create a validation entry for
     */
    async createUserValidation(userId: number): Promise<void> {
        await this.userValidations.insert({ userId });
    }

    /**
     * Check if all validations are valid for a user
     *
     * @param userId ID of the user to check
     * @returns Whether or not the user is valid
     */
    async isUserValid(userId: number): Promise<boolean> {
        try {
            const validation = await this.fetchValidation(userId);

            return validation.emailValidated && validation.userProfileReady;
        } catch {
            return false;
        }
    }

    /**
     * Set the user profile ready status of a user
     *
     * @param userId ID of the user to set the user profile ready status of
     * @param userProfileReady New user profile ready status
     */
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

    /**
     * Request an email validation for a user
     *
     * @param userId ID of the user to request an email validation for
     */
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

    /**
     * Validate an email
     *
     * @param userId ID of the user to validate the email of
     * @param token Token to validate the email with
     * @returns Whether or not the email was validated
     */
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
