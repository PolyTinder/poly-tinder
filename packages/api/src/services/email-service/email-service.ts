import { singleton } from 'tsyringe';
import { env } from '../../utils/environment';
import MailJet from 'node-mailjet';
import { Client } from 'node-mailjet';
import { normaliseEmail } from '../../utils/email';

@singleton()
export class EmailService {
    private mailjet: Client | undefined;

    constructor() {
        this.mailjet = this.init();
    }

    sendEmail(to: string, subject: string, content: string): Promise<unknown> {
        return this.haveAllRequiredEnvironmentVariables()
            ? this.sendEmailWithMailJet(to, subject, content)
            : this.sendEmailToConsole(to, subject, content);
    }

    private sendEmailWithMailJet(
        to: string,
        subject: string,
        content: string,
    ): Promise<unknown> {
        return (
            this.mailjet?.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: {
                            Email: env.EMAIL,
                        },
                        To: [
                            {
                                Email: normaliseEmail(to),
                            },
                        ],
                        Subject: subject,
                        HTMLPart: content,
                    },
                ],
            }) ?? Promise.resolve()
        );
    }

    private async sendEmailToConsole(
        to: string,
        subject: string,
        content: string,
    ): Promise<unknown> {
        // eslint-disable-next-line no-console
        console.log(
            'Sending email:\n\tTo: ' +
                to +
                '\n\tSubject: ' +
                subject +
                '\n\tContent: ' +
                content +
                '\n',
        );

        return;
    }

    private init() {
        return this.checkEnvironment()
            ? new MailJet({
                  apiKey: env.MJ_APIKEY_PUBLIC,
                  apiSecret: env.MJ_APIKEY_PRIVATE,
              })
            : undefined;
    }

    private checkEnvironment(): boolean {
        if (!this.haveAllRequiredEnvironmentVariables()) {
            if (env.NODE_ENV === 'production') {
                throw new Error(
                    'Missing required environment variables for email service',
                );
            } else {
                // eslint-disable-next-line no-console
                console.warn(
                    'Missing required environment variables for email service. Defaulting to console logging for development.',
                );

                return false;
            }
        }

        return true;
    }

    private haveAllRequiredEnvironmentVariables(): boolean {
        return (
            env.EMAIL !== undefined &&
            env.EMAIL.length > 0 &&
            env.MJ_APIKEY_PRIVATE !== undefined &&
            env.MJ_APIKEY_PRIVATE.length > 0 &&
            env.MJ_APIKEY_PUBLIC !== undefined &&
            env.MJ_APIKEY_PUBLIC.length > 0
        );
    }
}
