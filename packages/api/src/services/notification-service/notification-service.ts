import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { NotificationSubscription } from 'common/models/notification-subscription';
import {
    sendNotification,
    PushSubscription,
    VapidKeys,
    setVapidDetails,
} from 'web-push';

@singleton()
export class NotificationService {
    readonly vapidKey: VapidKeys = {
        publicKey:
            'BC7J1hDqhmWAb-N88JCvA_vgasQ433M8sD4Fl6qWyfiinOgW3qh62vJfrs2wWLg6I26JdsXwoXX2u7YS13XQbJA',
        privateKey: 'A1Nj53Yi95sVuPCN_xpUjyCnf13xwKh03mf2tXj98VQ',
    };
    payload = {
        notification: {
            title: 'Test Notification',
            body: '',
            data: {
                onActionClick: {
                    default: {
                        operation: 'focusLastFocusedOrOpen',
                        url: 'http:localhost:4200/',
                    },
                },
            },
        },
    };

    constructor(private readonly databaseService: DatabaseService) {}

    private get subscriptions(): Knex.QueryBuilder<NotificationSubscription> {
        return this.databaseService.database<NotificationSubscription>(
            'notification-subscription',
        );
    }

    async subscribe(userId: number, sub: PushSubscription): Promise<void> {
        await this.subscriptions.delete().where({ userId });
        const subscription: NotificationSubscription = {
            endpoint: sub.endpoint,
            auth: sub.keys.auth,
            p256dh: sub.keys.p256dh,
            userId: userId,
        };
        await this.subscriptions.insert(subscription);
    }

    async unsubscribe(userId: number): Promise<void> {
        await this.subscriptions.delete().where({ userId });
    }

    async notifyUser(
        userId: number,
        title: string,
        text?: string,
    ): Promise<void> {
        setVapidDetails(
            'mailto:miguel.vpereira14@gmail.com',
            this.vapidKey.publicKey,
            this.vapidKey.privateKey,
        );
        const sub: NotificationSubscription = await this.subscriptions
            .where({
                userId,
            })
            .first();
        if (sub) {
            const subscription: PushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh,
                },
            };
            this.payload.notification.title = title;
            this.payload.notification.body = text || '';
            try {
                await sendNotification(
                    subscription,
                    JSON.stringify(this.payload),
                );
            } catch (error) {
                /* empty */
            }
        }
    }
}
