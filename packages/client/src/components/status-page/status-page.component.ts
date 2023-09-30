import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-status-page',
    templateUrl: './status-page.component.html',
    styleUrls: ['./status-page.component.scss'],
})
export class StatusPageComponent {
    @Input() message: string = '';
    @Input() isLoading: boolean = true;
    @Input() isError: boolean = false;
}
