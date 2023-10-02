import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DefaultModalParameters } from '../types/default-modal';
import { DefaultModalComponent } from '../components/default-modal/default-modal.component';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor(private readonly dialog: MatDialog) {}

    open(modal: DefaultModalParameters) {
        this.dialog.open<DefaultModalComponent, DefaultModalParameters>(
            DefaultModalComponent,
            {
                data: modal,
            },
        );
    }
}
