import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly VAPID_PUBLIC_KEY =
        'BC7J1hDqhmWAb-N88JCvA_vgasQ433M8sD4Fl6qWyfiinOgW3qh62vJfrs2wWLg6I26JdsXwoXX2u7YS13XQbJA';

    constructor(
        private readonly http: HttpClient,
        private readonly swPush: SwPush,
    ) {}

    subscribe(userId: number) {
        const notification = Notification;
        if (notification.permission === 'denied') {
            this.http.post(`/notification/unsubscribe`, { userId });
            return;
        }

        this.swPush
            .requestSubscription({
                serverPublicKey: this.VAPID_PUBLIC_KEY,
            })
            .then((sub) => {
                this.http
                    .post(`/notification/subscribe`, { userId, sub })
                    .subscribe();
            });
    }
}
