import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { UserProfile } from 'common/models/user';
import {
    sendNotification,
    PushSubscription,
    SendResult,
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
    readonly payload = {
        notification: {
            title: 'Test Notification',
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

    private get subscribedUsers() {
        return this.databaseService.database<UserProfile>('user');
    }

    async subscribe(sub: PushSubscription): Promise<SendResult> {
        setVapidDetails(
            'mailto:miguel.vpereira14@gmail.com',
            this.vapidKey.publicKey,
            this.vapidKey.privateKey,
        );
        return sendNotification(sub, JSON.stringify(this.payload));
    }
}
