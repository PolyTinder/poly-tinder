import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent {
    @Input() icon: string | undefined;
    @Input() title: string | undefined;
    @Input() anchor: string | undefined;
    @Input() noPadding: boolean = false;

    constructor(private readonly router: Router) {}

    get hasHeader() {
        return this.icon || this.title;
    }

    get currentUrl() {
        return this.router.url;
    }
}
