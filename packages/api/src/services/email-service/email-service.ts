import { singleton } from 'tsyringe';
import { env } from '../../utils/environment';
import MailJet from 'node-mailjet';
import { Client } from 'node-mailjet';

@singleton()
export class EmailService {
    private mailjet: Client;

    constructor() {
        this.mailjet = this.init();
    }

    sendEmail(to: string, subject: string, content: string): Promise<unknown> {
        return this.mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: env.EMAIL,
                    },
                    To: [
                        {
                            Email: to,
                        },
                    ],
                    Subject: subject,
                    HTMLPart: content,
                },
            ],
        });
    }

    private init() {
        return new MailJet({
            apiKey: env.MJ_APIKEY_PUBLIC,
            apiSecret: env.MJ_APIKEY_PRIVATE,
        });
    }
}
