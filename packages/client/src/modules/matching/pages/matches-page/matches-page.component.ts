import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PublicProfileService } from 'src/modules/matching/services/public-profile-service/public-profile.service';
import { MatchListItemClass } from '../../models/match-list-item';
import { ValidationService } from 'src/modules/validation/services/validation.service';

@Component({
    selector: 'app-matches-page',
    templateUrl: './matches-page.component.html',
    styleUrls: ['./matches-page.component.scss'],
})
export class MatchesPageComponent {
    matches: Observable<MatchListItemClass[]>;
    conversations: Observable<MatchListItemClass[]>;
    hasMatches: Observable<boolean>;
    hasConversations: Observable<boolean>;

    constructor(
        private readonly publicProfileService: PublicProfileService,
        private readonly validationService: ValidationService,
    ) {
        this.matches = this.publicProfileService.matches.pipe(
            map((matches) =>
                matches.filter((match) => match.queryInfo.messagesCount === 0),
            ),
        );
        this.conversations = this.publicProfileService.matches.pipe(
            map((matches) =>
                matches
                    .filter((match) => match.queryInfo.messagesCount > 0)
                    .sort((a, b) =>
                        new Date(a.queryInfo.lastMessageTimestamp) >
                        new Date(b.queryInfo.lastMessageTimestamp)
                            ? -1
                            : 1,
                    ),
            ),
        );
        this.hasMatches = this.matches.pipe(
            map((matches) => matches.length > 0),
        );
        this.hasConversations = this.conversations.pipe(
            map((conversations) => conversations.length > 0),
        );

        this.publicProfileService.fetchMatches().subscribe();
    }

    get userValid() {
        return this.validationService.userProfileReady;
    }
}
