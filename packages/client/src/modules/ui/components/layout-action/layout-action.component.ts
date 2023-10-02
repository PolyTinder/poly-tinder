import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-layout-action',
    templateUrl: './layout-action.component.html',
    styleUrls: ['./layout-action.component.scss'],
})
export class LayoutActionComponent {
    @Input() content?: string;
    @Input() icon?: string;
    @Input() link?: string;
    @Input() action?: () => void;
    @Input() disabled?: boolean;
    @Input() iconAdjustH: number = 0;
    @Input() iconAdjustV: number = 0;

    constructor(private readonly router: Router) {}

    handleClick(): void {
        if (this.disabled) {
            return;
        }

        if (this.action) {
            this.action();
        }

        if (this.link) {
            this.router.navigate([this.link]);
        }
    }
}
