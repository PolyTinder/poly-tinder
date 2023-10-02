import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { REPORT_REASONS } from '../../../modals/constants/reports';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModerationService } from '../../services/moderation.service';

@Component({
    selector: 'app-report-user-modal',
    templateUrl: './report-user-modal.component.html',
    styleUrls: ['./report-user-modal.component.scss'],
})
export class ReportUserModalComponent {
    form: FormGroup = new FormGroup({
        reason: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
        ]),
        description: new FormControl('', []),
    });
    reasons = REPORT_REASONS;

    constructor(
        private readonly dialogRef: DialogRef<ReportUserModalComponent>,
        @Inject(MAT_DIALOG_DATA)
        public readonly data: { userId: number; userName: string },
        private readonly moderationService: ModerationService,
    ) {}

    onSubmit() {
        if (this.form.valid) {
            this.moderationService
                .sendReport(
                    this.data.userId,
                    this.form.value.reason,
                    this.form.value.description,
                )
                .subscribe(() => {
                    this.dialogRef.close();
                });
        }
    }
}
