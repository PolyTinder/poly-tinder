import { Component } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { PublicUserResultClass } from '../../models/public-user-result';
import { ActivatedRoute } from '@angular/router';
import { PublicProfileService } from '../../services/public-profile-service/public-profile.service';

@Component({
    selector: 'app-matched-user-profile-page',
    templateUrl: './matched-user-profile-page.component.html',
    styleUrls: ['./matched-user-profile-page.component.scss'],
})
export class MatchedUserProfilePageComponent {
    userProfile: Observable<PublicUserResultClass | undefined>;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly publicProfileService: PublicProfileService,
    ) {
        this.userProfile = this.route.params.pipe(
            map((params) => {
                if (!params['id']) {
                    throw new Error('No id provided');
                }

                return Number(params['id']);
            }),
            switchMap((userId) => this.publicProfileService.getMatch(userId)),
        );
    }
}
