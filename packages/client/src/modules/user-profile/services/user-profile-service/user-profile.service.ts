import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserPublicSession } from 'common/models/authentication';
import { UserProfile } from 'common/models/user';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';
import { ValidationService } from 'src/modules/validation/services/validation.service';

@Injectable({
    providedIn: 'root',
})
export class UserProfileService {
    private userProfile$ = new BehaviorSubject<UserProfile | undefined>(
        undefined,
    );
    userProfileDirty$ = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly sessionService: SessionService,
        private readonly validationService: ValidationService,
        private readonly http: HttpClient,
    ) {
        this.sessionService.session.subscribe((session) =>
            this.handleSession(session),
        );
    }

    getUserProfile(): Observable<UserProfile | undefined> {
        return this.userProfile$.asObservable();
    }

    setUserProfile(userProfile: UserProfile) {
        this.userProfile$.next(userProfile);
        this.userProfileDirty$.next(true);
    }

    updateUserProfile(userProfile: Omit<Partial<UserProfile>, 'userId'>) {
        const currentProfile = this.userProfile$.value;

        if (!currentProfile) {
            throw new Error('User profile not found');
        }

        this.userProfile$.next({
            ...currentProfile,
            ...userProfile,
            userId: currentProfile.userId,
        });
        this.userProfileDirty$.next(true);
    }

    applyUserProfileChanges(): Observable<UserProfile | undefined> {
        if (!this.userProfileDirty$.value) {
            return of(this.userProfile$.value);
        }

        return this.http
            .patch('/user/profile', { userProfile: this.userProfile$.value })
            .pipe(
                tap(() => {
                    this.userProfileDirty$.next(false);
                }),
                switchMap(() =>
                    this.fetchUserProfile().pipe(
                        tap((userProfile) => {
                            this.userProfile$.next(userProfile);
                        }),
                    ),
                ),
            );
    }

    private handleSession(session: UserPublicSession | undefined) {
        if (session) {
            this.fetchUserProfile().subscribe((userProfile) => {
                this.userProfile$.next(userProfile);
            });
        } else {
            this.userProfile$.next(undefined);
        }
        this.userProfileDirty$.next(false);
    }

    private fetchUserProfile() {
        return this.http.get<UserProfile>('/user/profile');
    }
}
