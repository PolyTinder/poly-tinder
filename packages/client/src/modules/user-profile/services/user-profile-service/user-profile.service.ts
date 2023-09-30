import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserPublicSession } from 'common/models/authentication';
import { UserProfile } from 'common/models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';

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
        private readonly http: HttpClient,
    ) {
        this.sessionService.session$.subscribe((session) =>
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

    applyUserProfileChanges() {
        if (!this.userProfileDirty$.value) {
            return;
        }

        this.http
            .patch('/user/profile', { userProfile: this.userProfile$.value })
            .subscribe(() => {
                this.userProfileDirty$.next(false);
                this.fetchUserProfile().subscribe((userProfile) => {
                    this.userProfile$.next(userProfile);
                });
            });
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
