import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PublicUserResultClass } from '../../models/public-user-result';
import { PublicProfileService } from '../../services/public-profile-service/public-profile.service';
import { MatchingService } from '../../services/matching-service/matching.service';
import { ValidationService } from 'src/modules/validation/services/validation.service';

@Component({
    selector: 'app-swiping-page',
    templateUrl: './swiping-page.component.html',
    styleUrls: ['./swiping-page.component.scss'],
})
export class SwipingPageComponent {
    availableUsers: BehaviorSubject<PublicUserResultClass[]> =
        new BehaviorSubject<PublicUserResultClass[]>([]);

    constructor(
        private readonly publicProfileService: PublicProfileService,
        private readonly matchingService: MatchingService,
        private readonly validationService: ValidationService,
    ) {
        this.fetchNext();
    }

    get userValid() {
        return this.validationService.userValid;
    }

    fetchNext() {
        this.publicProfileService.getAvailableUsers().subscribe((users) => {
            this.availableUsers.next([...this.availableUsers.value, ...users]);
        });
    }

    likeUser(user: PublicUserResultClass) {
        this.removeUser(user);
        this.matchingService.likeUser(user.currentValue.userId).subscribe();
    }

    dislikeUser(user: PublicUserResultClass) {
        this.removeUser(user);
        this.matchingService.likeUser(user.currentValue.userId).subscribe();
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
