import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    AuthenticationUser,
    UserPublicSession,
} from 'common/models/authentication';
import { Observable, catchError, map, switchMap, tap } from 'rxjs';
import { SessionService } from '../session-service/session.service';
import { Router } from '@angular/router';
import { LOGIN_ROUTE } from 'src/constants/routes';
import { WsService } from 'src/services/ws-service/ws.service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    constructor(
        private readonly http: HttpClient,
        private readonly sessionService: SessionService,
        private readonly router: Router,
        private readonly wsService: WsService,
    ) {}

    login(user: AuthenticationUser): Observable<UserPublicSession> {
        return this.http.post<UserPublicSession>('/auth/login', user).pipe(
            switchMap((session) => this.wsService.connect(session.token).pipe(
                    catchError((error, caugth) => {
                        this.sessionService.session$.next(undefined);
                        this.router.navigate([LOGIN_ROUTE]);

                        return caugth;
                    }),
                    tap(() => this.sessionService.session$.next(session)),
                    map(() => session),
                )
            ),
        );
    }

    signup(user: AuthenticationUser): Observable<UserPublicSession> {
        return this.http.post<UserPublicSession>('/auth/signup', user).pipe(
            switchMap((session) => this.wsService.connect(session.token).pipe(
                catchError((error, caugth) => {
                    this.sessionService.session$.next(undefined);
                    this.router.navigate([LOGIN_ROUTE]);

                    return caugth;
                }),
                tap(() => this.sessionService.session$.next(session)),
                map(() => session),
            )
        ),
        );
    }

    logout(): Observable<void> {
        return this.http.post<void>('/auth/logout', {}).pipe(
            tap(() => {
                this.sessionService.session$.next(undefined);
                this.router.navigate([LOGIN_ROUTE]);
                this.wsService.disconnect();
            }),
        );
    }

    loadSession(): Observable<UserPublicSession> {
        const token = this.sessionService.getLocalToken();

        if (!token) {
            return new Observable<UserPublicSession>();
        }

        return this.http.post<UserPublicSession>('/auth/load', { token }).pipe(
            tap((session) => {
                this.sessionService.session$.next(session);
            }),
        );
    }
}
