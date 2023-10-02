import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WsServer } from 'common/models/ws';
import { WsService } from 'src/services/ws-service/ws.service';
import { PublicProfileService } from '../public-profile-service/public-profile.service';
import { map, switchMap } from 'rxjs';
import { ModalService } from 'src/modules/modals/services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicUserResultClass } from '../../models/public-user-result';

@Injectable({
    providedIn: 'root',
})
export class MatchingService {
    constructor(
        private readonly http: HttpClient,
        private readonly wsService: WsService,
        private readonly dialog: MatDialog,
        private readonly publicProfileService: PublicProfileService,
        private readonly modalService: ModalService,
        private readonly snackBar: MatSnackBar,
    ) {
        this.instantiate();
    }

    likeUser(userId: number) {
        return this.http.post(`/matching/like/${userId}`, {}).pipe(
            switchMap(() => this.publicProfileService.fetchMatches()),
            map(() => {}),
        );
    }

    dislikeUser(userId: number) {
        return this.http.post(`/matching/dislike/${userId}`, {}).pipe(
            switchMap(() => this.publicProfileService.fetchMatches()),
            map(() => {}),
        );
    }

    unmatchedUser(userId: number) {
        return this.http.post(`/matching/unmatch/${userId}`, {}).pipe(
            switchMap(() => this.publicProfileService.fetchMatches()),
            map(() => {}),
        );
    }

    askUnmatchUser(user: PublicUserResultClass) {
        this.modalService.open({
            title: `Supprimer ${user.currentValue.name} de vos matchs ?`,
            content: `Vous ne pourrez plus lui envoyer de messages.`,
            buttons: [
                {
                    content: 'Annuler',
                    closeDialog: true,
                },
                {
                    content: 'Supprimer',
                    closeDialog: true,
                    color: true,
                    action: () => this.unmatchedUser(user.id).subscribe(),
                },
            ],
        });
    }

    private instantiate() {
        this.wsService
            .listen('match:matched-active')
            .subscribe((data) => this.handleMatch(data, true));
        this.wsService
            .listen('match:matched-passive')
            .subscribe((data) => this.handleMatch(data, false));
    }

    private handleMatch(
        {
            matchedUserId,
        }: WsServer['match:matched-active' | 'match:matched-passive'],
        active: boolean,
    ) {
        this.publicProfileService.fetchMatches().subscribe((result) => {
            const user = result.find((user) => user.id === matchedUserId);

            if (!user) {
                throw new Error('User not found');
            }

            user.loaded.subscribe((loaded) => {
                if (loaded) {
                    if (active) {
                        this.modalService.open({
                            title: "C'est un match !",
                            content: `Vous avez matché avec ${user.currentValue.name} !`,
                            buttons: [
                                {
                                    content: 'Plus tard',
                                    closeDialog: true,
                                },
                                {
                                    content: 'Discuter',
                                    redirect: `/matches/${user.id}`,
                                    color: true,
                                },
                            ],
                        });
                    } else {
                        this.snackBar.open(
                            `Nouveau match avec ${user.currentValue.name} !`,
                            undefined,
                            { duration: 2000, verticalPosition: 'top' },
                        );
                    }
                }
            });
        });
    }
}
