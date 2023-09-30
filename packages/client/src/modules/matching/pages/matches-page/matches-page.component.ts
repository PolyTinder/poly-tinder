import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicUserResultClass } from 'src/modules/matching/models/public-user-result';
import { PublicProfileService } from 'src/modules/matching/services/public-profile-service/public-profile.service';

@Component({
    selector: 'app-matches-page',
    templateUrl: './matches-page.component.html',
    styleUrls: ['./matches-page.component.scss'],
})
export class MatchesPageComponent {
    matches: Observable<PublicUserResultClass[]>;

    constructor(private readonly publicProfileService: PublicProfileService) {
        this.matches = this.publicProfileService.matches;
        this.publicProfileService.fetchMatches().subscribe();
    }
}
