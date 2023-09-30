import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PublicUserResultClass } from 'src/modules/matching/models/public-user-result';
import { PublicProfileService } from 'src/modules/matching/services/public-profile-service/public-profile.service';

@Component({
    selector: 'app-matches-page',
    templateUrl: './matches-page.component.html',
    styleUrls: ['./matches-page.component.scss'],
})
export class MatchesPageComponent {
    matches: BehaviorSubject<PublicUserResultClass[]> = new BehaviorSubject<
        PublicUserResultClass[]
    >([]);

    constructor(private readonly publicProfileService: PublicProfileService) {
        this.fetch();
    }

    fetch() {
        this.publicProfileService.getMatches().subscribe((users) => {
            this.matches.next([...this.matches.value, ...users]);
        });
    }
}
