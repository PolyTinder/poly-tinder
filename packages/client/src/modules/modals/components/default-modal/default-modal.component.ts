import { Component, Inject } from '@angular/core';
import {
    DefaultModalButtonParameters,
    DefaultModalParameters,
} from '../../types/default-modal';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-default-modal',
    templateUrl: './default-modal.component.html',
    styleUrls: ['./default-modal.component.scss'],
})
export class DefaultModalComponent {
    title: string;
    content: string | undefined;
    buttons: DefaultModalButtonParameters[];

    constructor(
        @Inject(MAT_DIALOG_DATA) data: DefaultModalParameters,
        private readonly router: Router,
    ) {
        this.title = data.title;
        this.content = data.content;
        this.buttons =
            data.buttons?.map((button) => ({
                ...button,
                closeDialog: button.redirect
                    ? true
                    : button.closeDialog ?? false,
            })) ?? [];
    }

    handleButton(button: DefaultModalButtonParameters): void {
        if (button.action) button.action();
        if (button.redirect) this.router.navigate([button.redirect]);
    }
}
