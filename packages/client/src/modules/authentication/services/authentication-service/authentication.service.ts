import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationUser, UserPublicSession } from 'common/models/authentication';
import { Observable, tap } from 'rxjs';
import { SessionService } from '../session-service/session.service';
import { Router } from '@angular/router';
import { LOGIN_ROUTE } from 'src/constants/routes';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    constructor(private readonly http: HttpClient, private readonly sessionService: SessionService, private readonly router: Router) { }

    login(user: AuthenticationUser): Observable<UserPublicSession> {
        return this.http.post<UserPublicSession>('/auth/login', user).pipe(tap((session) => {
            this.sessionService.session$.next(session);
        }));
    }

    signup(user: AuthenticationUser): Observable<UserPublicSession> {
        return this.http.post<UserPublicSession>('/auth/signup', user).pipe(tap((session) => {
            this.sessionService.session$.next(session);
        }));
    }

    logout(): Observable<void> {
        return this.http.post<void>('/auth/logout', {}).pipe(tap(() => {
            this.sessionService.session$.next(undefined);
            this.router.navigate([LOGIN_ROUTE]);
        }));
    }

    loadSession(): Observable<UserPublicSession> {
        const token = this.sessionService.getLocalToken();

        if (!token) {
            return new Observable<UserPublicSession>();
        }

        return this.http.post<UserPublicSession>('/auth/load', { token }).pipe(tap((session) => {
            this.sessionService.session$.next(session);
        }));
    }
}
