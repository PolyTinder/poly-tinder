import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WsServer } from 'common/models/ws';
import { WsService } from 'src/services/ws-service/ws.service';
import { MatchedModalComponent } from '../../components/matched-modal/matched-modal.component';
import { PublicUserResult } from 'common/models/user';
import { PublicProfileService } from '../public-profile-service/public-profile.service';

@Injectable({
    providedIn: 'root',
})
export class MatchingService {
    constructor(
        private readonly http: HttpClient,
        private readonly wsService: WsService,
        private readonly dialog: MatDialog,
        private readonly publicProfileService: PublicProfileService,
    ) {
        this.instantiate();
    }

    likeUser(userId: number) {
        return this.http.post(`/matching/like/${userId}`, {});
    }

    dislikeUser(userId: number) {
        return this.http.post(`/matching/dislike/${userId}`, {});
    }

    private instantiate() {
        this.wsService.listen('match').subscribe(this.handleMatch.bind(this));
    }

    private handleMatch({ matchedUserId }: WsServer['match']) {
        this.publicProfileService.fetchMatches().subscribe((result) => {
            const user = result.find((user) => user.getId() === matchedUserId);

            if (!user) {
                console.error('Could not find user');
                return;
            }

            user.loaded.subscribe((loaded) => {
                if(loaded) this.dialog.open<MatchedModalComponent, PublicUserResult>(MatchedModalComponent, {
                    data: user.currentLoadedValue,
                });
            });
        });

    }
}
