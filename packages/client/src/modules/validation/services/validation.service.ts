import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserValidationResponse } from 'common/models/user';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';
import { WsService } from 'src/services/ws-service/ws.service';

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    private userProfileReady$: BehaviorSubject<boolean | undefined> =
        new BehaviorSubject<boolean | undefined>(undefined);

    constructor(
        private readonly wsService: WsService,
        private readonly http: HttpClient,
        private readonly sessionService: SessionService,
    ) {
        this.wsService
            .listen('user-validation:update')
            .subscribe(({ userProfileReady }) => {
                this.userProfileReady$.next(userProfileReady);
            });

        this.sessionService.isLoggedIn().subscribe((isLoggedIn) => {
            if (isLoggedIn) {
                this.fetchValidation().subscribe();
            } else {
                this.userProfileReady$.next(undefined);
            }
        });
    }

    get userProfileReady(): Observable<boolean | undefined> {
        return this.userProfileReady$.asObservable();
    }

    private fetchValidation(): Observable<boolean> {
        return this.http.get<UserValidationResponse>('/user-validation').pipe(
            tap(({ userProfileReady }) =>
                this.userProfileReady$.next(Boolean(userProfileReady)),
            ),
            map(({ userProfileReady }) => userProfileReady),
        );
    }
}
