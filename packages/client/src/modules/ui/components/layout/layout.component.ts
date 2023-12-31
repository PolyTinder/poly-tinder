import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
    @Input() headerType: 'default' | 'transparent' | 'hidden' = 'default';
    @Input() noGap: boolean = false;
}
