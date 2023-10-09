import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserPublicSession } from 'common/models/authentication';
import { SESSION_TOKEN_KEY } from '../../constants/local-storage';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private session$: BehaviorSubject<UserPublicSession | undefined> =
        new BehaviorSubject<UserPublicSession | undefined>(undefined);

    constructor() {
        this.session$.subscribe((session) => this.handleSession(session));
    }

    get session(): Observable<UserPublicSession | undefined> {
        return this.session$.asObservable();
    }

    setSession(session: UserPublicSession | undefined): void {
        if (session?.token === this.session$.value?.token) return;
        this.session$.next(session);
    }

    isLoggedIn(): Observable<boolean> {
        return this.session$
            .asObservable()
            .pipe(map((session) => session !== undefined));
    }

    isCurrentlyLoggedIn(): boolean {
        return this.session$.value !== undefined;
    }

    getCurrentSession(): UserPublicSession {
        if (!this.session$.value) {
            throw new Error('No session is currently logged in');
        }
        return this.session$.value;
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
