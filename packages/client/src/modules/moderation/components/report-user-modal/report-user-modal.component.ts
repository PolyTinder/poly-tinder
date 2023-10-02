import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { REPORT_REASONS } from '../../../modals/constants/reports';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    ) {}

    onSubmit() {
        if (this.form.valid) {
            console.log('report', this.form.value, this.data);
            this.dialogRef.close(this.form.value);
        }
    }
}
