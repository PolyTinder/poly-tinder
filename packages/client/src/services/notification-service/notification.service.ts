import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    readonly VAPID_PUBLIC_KEY =
        'BC7J1hDqhmWAb-N88JCvA_vgasQ433M8sD4Fl6qWyfiinOgW3qh62vJfrs2wWLg6I26JdsXwoXX2u7YS13XQbJA';

    constructor(
        private readonly http: HttpClient,
        private readonly swPush: SwPush,
    ) {}

    createNotification() {
        this.swPush
            .requestSubscription({
                serverPublicKey: this.VAPID_PUBLIC_KEY,
            })
            .then((sub) => {
                this.http.post(`/notification/subscribe`, sub).subscribe();
            });
    }

    // TODO: send this object to the backend to be stored, or just set notification=enabled in the db
}
