import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserPublicSession } from 'common/models/authentication';
import { SESSION_TOKEN_KEY } from '../../constants/local-storage';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    session$: BehaviorSubject<UserPublicSession | undefined> =
        new BehaviorSubject<UserPublicSession | undefined>(undefined);

    constructor() {
        this.session$.subscribe((session) => this.handleSession(session));
    }

    isLoggedIn(): Observable<boolean> {
        return this.session$
            .asObservable()
            .pipe(map((session) => session !== undefined));
    }

    private handleSession(session: UserPublicSession | undefined): void {
        if (session) {
            this.setLocalToken(session.token);
        }
    }

    getLocalToken(): string | null {
        return localStorage.getItem(SESSION_TOKEN_KEY);
    }

    private setLocalToken(token: string): void {
        localStorage.setItem(SESSION_TOKEN_KEY, token);
    }

    private removeLocalToken(): void {
        localStorage.removeItem(SESSION_TOKEN_KEY);
    }
}
