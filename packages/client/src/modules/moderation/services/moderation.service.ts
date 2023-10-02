import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportUserModalComponent } from '../components/report-user-modal/report-user-modal.component';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalService } from 'src/modules/modals/services/modal.service';
import { PublicProfileService } from 'src/modules/matching/services/public-profile-service/public-profile.service';

@Injectable({
    providedIn: 'root',
})
export class ModerationService {
    constructor(
        private readonly modalService: ModalService,
        private readonly dialog: MatDialog,
        private readonly http: HttpClient,
        private readonly snackBar: MatSnackBar,
        private readonly publicProfileService: PublicProfileService,
    ) {}

    openReportUserModal(userId: number, userName: string) {
        this.dialog.open(ReportUserModalComponent, {
            data: { userId, userName },
        });
    }

    openBlockUserModal(userId: number, userName: string): Observable<void> {
        const subject = new Subject<void>();
        this.modalService.open({
            title: 'Bloquer un utilisateur',
            content: `Êtes-vous sûr de vouloir bloquer ${userName} ?`,
            buttons: [
                {
                    content: 'Annuler',
                    closeDialog: true,
                    action: () => {
                        subject.error('Canceled by user');
                    },
                },
                {
                    content: 'Bloquer',
                    action: () => {
                        this.blockUser(userId).subscribe(() => {
                            subject.next();
                        });
                    },
                    color: true,
                },
            ],
        });
        return subject;
    }

    sendReport(
        userId: number,
        reportType: string,
        description: string | undefined,
    ) {
        return this.http
            .post<void>(`/moderation/report/${userId}`, {
                reportType,
                description,
            })
            .pipe(
                tap(() => {
                    this.snackBar.open(
                        "L'utilisateur a été signalé. Merci !",
                        undefined,
                        {
                            duration: 2000,
                        },
                    );
                }),
            );
    }

    blockUser(userId: number) {
        return this.http.post<void>(`/moderation/block/${userId}`, {}).pipe(
            tap(() => {
                this.snackBar.open(
                    "L'utilisateur a été bloqué. Merci !",
                    undefined,
                    {
                        duration: 2000,
                    },
                );
                this.publicProfileService.fetchMatches().subscribe();
            }),
        );
    }
}
