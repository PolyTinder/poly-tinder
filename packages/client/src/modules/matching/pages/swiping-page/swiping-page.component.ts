import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, timeout } from 'rxjs';
import { PublicUserResultClass } from '../../models/public-user-result';
import { PublicProfileService } from '../../services/public-profile-service/public-profile.service';
import { MatchingService } from '../../services/matching-service/matching.service';
import { ValidationService } from 'src/modules/validation/services/validation.service';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';

@Component({
    selector: 'app-swiping-page',
    templateUrl: './swiping-page.component.html',
    styleUrls: ['./swiping-page.component.scss'],
})
export class SwipingPageComponent {
    availableUsers: BehaviorSubject<PublicUserResultClass[]> =
        new BehaviorSubject<PublicUserResultClass[]>([]);
    loading = new BehaviorSubject<boolean>(true);

    constructor(
        private readonly publicProfileService: PublicProfileService,
        private readonly matchingService: MatchingService,
        private readonly sessionService: SessionService,
        private readonly validationService: ValidationService,
    ) {
        combineLatest([
            this.sessionService.isLoggedIn(),
            this.validationService.userValid,
        ]).subscribe(([isLoggedIn, userValid]) => {
            if (isLoggedIn && userValid) {
                this.fetchNext();
            } else {
                this.availableUsers.next([]);
            }
        });
    }

    get userValid() {
        return this.validationService.userValid;
    }

    get userValidMessage() {
        return this.validationService.userValidMessage;
    }

    get availableUsersDelayed() {
        return this.availableUsers.pipe(timeout(100));
    }

    fetchNext() {
        this.publicProfileService.getAvailableUsers().subscribe((users) => {
            this.availableUsers.next([...this.availableUsers.value, ...users]);
            this.loading.next(false);
        });
    }

    likeUser(user: PublicUserResultClass) {
        this.removeUser(user);
        this.matchingService.likeUser(user.currentValue.userId).subscribe();
    }

    dislikeUser(user: PublicUserResultClass) {
        this.removeUser(user);
        this.matchingService.dislikeUser(user.currentValue.userId).subscribe();
    }

    onExcludeUser(user: PublicUserResultClass) {
        this.removeUser(user);
    }

    private removeUser(user: PublicUserResultClass) {
        this.availableUsers.next(
            this.availableUsers.value.filter((u) => u !== user),
        );
    }
}
