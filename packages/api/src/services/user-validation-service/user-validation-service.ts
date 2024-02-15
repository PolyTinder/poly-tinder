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
    async requestEmailValidation(userId: number): Promise<unknown> {
        const user = await this.userService.getUser(userId);
        const token = await this.verificationTokenService.generateToken(
            userId,
            'email',
        );

        const url = `${
            env.NODE_ENV === 'production'
                ? 'https://projet-agir-2024-prod-client-rbzlbnwr7q-ew.a.run.app'
                : 'http://localhost:4200'
        }/verify-email?token=${encodeURIComponent(token)}`;

        const content = `
            <table style="margin: 0 auto; text-align: center; font-family: 'Onest', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important">
                <tbody>
                    <tr>
                        <th>
                            <a href=""><img height="100" src="https://projet-agir-2024-prod-client-rbzlbnwr7q-ew.a.run.app/assets/logo.svg" alt="INSA Meet logo"></a>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <h1>Confirmer votre email</h1>
                            <p style="font-weight: 400;">Veuillez confirmer votre email afin d'utiliser l'application INSA Meet</p>
                            <a href="${url}" style="text-decoration: none; text-align: center; cursor: pointer;"><button style="cursor: pointer; padding: 12px 24px; width: 100%; max-width: 300px; border-radius: 6px; font-size: 1em; font-weight: 500; background: linear-gradient(90deg, rgb(210, 59, 44), #CF6A5C); border: none; color: white;">Confirmer mon email</button></a>
                            <p style="font-weight: 400;">Ou cliquez sur le lien suivant <a href="${url}">${url}</a></p>
                        </th>
                    </tr>
                </tbody>
            </table>
        `;

        return await this.emailService.sendEmail(
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
