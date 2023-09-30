import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PublicUserResult } from 'common/models/user';

@Component({
    selector: 'app-matched-modal',
    templateUrl: './matched-modal.component.html',
    styleUrls: ['./matched-modal.component.scss'],
})
export class MatchedModalComponent {
    constructor(public dialogRef: MatDialogRef<MatchedModalComponent>, @Inject(MAT_DIALOG_DATA) public userProfile: PublicUserResult) {} 
}
