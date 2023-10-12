import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-about-layout',
    templateUrl: './about-layout.component.html',
    styleUrls: ['./about-layout.component.scss'],
})
export class AboutLayoutComponent {
    @Input() title!: string;
    @Input() backLink?: string;
}
