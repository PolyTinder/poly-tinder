import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    AuthenticationUser,
    UserPublicSession,
} from 'common/models/authentication';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { SessionService } from '../session-service/session.service';
import { Router } from '@angular/router';
import { HOME_ROUTE, LOGIN_ROUTE } from 'src/constants/routes';
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
            switchMap((session) =>
                this.wsService.connect(session.token).pipe(
                    tap(() => {
                        this.sessionService.session$.next(session);
                        this.router.navigate([HOME_ROUTE]);
                    }),
                    map(() => session),
                ),
            ),
        );
    }

    signup(user: AuthenticationUser): Observable<UserPublicSession> {
        return this.http.post<UserPublicSession>('/auth/signup', user).pipe(
            switchMap((session) =>
                this.wsService.connect(session.token).pipe(
                    tap(() => {
                        this.sessionService.session$.next(session);
                        this.router.navigate([HOME_ROUTE]);
                    }),
                    map(() => session),
                ),
            ),
        );
    }

    logout(ignoreApi: boolean = false): Observable<void> {
        const onLogout = () => {
            this.wsService.disconnect();
            this.sessionService.session$.next(undefined);
            this.router.navigate([LOGIN_ROUTE]);
        };

        if (ignoreApi) {
            onLogout();
            return of();
        }

        return this.http
            .post<void>('/auth/logout', {})
            .pipe(tap(() => onLogout()));
    }

    loadSession(): Observable<UserPublicSession | undefined> {
        const token = this.sessionService.getLocalToken();

        if (!token) {
            return of(undefined);
        }

        return this.http.post<UserPublicSession>('/auth/load', { token }).pipe(
            tap((session) => {
                this.sessionService.session$.next(session);
            }),
            catchError(() => of(undefined)),
        );
    }

    requestPasswordReset(email: string): Observable<void> {
        return this.http.post<void>('/auth/password-reset/request', { email });
    }

    resetPassword(token: string, newPassword: string): Observable<void> {
        return this.http.post<void>('/auth/password-reset', {
            token,
            newPassword,
        });
    }
}
