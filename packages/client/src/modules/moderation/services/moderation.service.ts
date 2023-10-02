import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportUserModalComponent } from '../components/report-user-modal/report-user-modal.component';

@Injectable({
    providedIn: 'root',
})
export class ModerationService {
    constructor(private readonly dialog: MatDialog) {}

    reportUser(userId: number, userName: string) {
        this.dialog.open(ReportUserModalComponent, {
            data: { userId, userName },
        });
    }

    private sendReport() {}
}
