import { Component } from '@angular/core';
import { NotLoadedPublicUserResult, PublicUserResult } from 'common/models/user';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { AuthenticationService } from 'src/modules/authentication/services/authentication-service/authentication.service';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';
import { PublicUserResultClass } from 'src/modules/matching/models/public-user-result';
import { MatchingService } from 'src/modules/matching/services/matching-service/matching.service';
import { PublicProfileService } from 'src/modules/matching/services/public-profile-service/public-profile.service';
import { OrderedMap } from 'src/utils/ordered-map';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
    availableUsers: BehaviorSubject<PublicUserResultClass[]> = new BehaviorSubject<PublicUserResultClass[]>([]);

    constructor(private readonly authenticationService: AuthenticationService, private readonly sessionService: SessionService, private readonly publicProfileService: PublicProfileService, private readonly matchingService: MatchingService) {
        console.log('home')
        this.fetchNext();
    }

    logout() {
        this.authenticationService.logout().subscribe();
    }

    fetchNext() {
        this.publicProfileService.getAvailableUsers().subscribe((users) => {
            this.availableUsers.next([...this.availableUsers.value, ...users]);
        });
    }

    likeUser(user: PublicUserResultClass) {
        this.removeUser(user);
        this.matchingService.likeUser(user.loadedValue.userAliasId).subscribe();
    }

    dislikeUser(user: PublicUserResultClass) {
        this.removeUser(user);
        this.matchingService.likeUser(user.loadedValue.userAliasId).subscribe();
    }

    private removeUser(user: PublicUserResultClass) {
        this.availableUsers.next(this.availableUsers.value.filter((u) => u !== user));
    }

    get user() {
        return this.sessionService.session$.pipe(map((session) => session?.user));
    }
}
