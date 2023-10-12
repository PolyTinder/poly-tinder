import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-about-card',
    templateUrl: './about-card.component.html',
    styleUrls: ['./about-card.component.scss'],
})
export class AboutCardComponent {
    @Input() title!: string;
    @Input() subtitle!: string;
    @Input() image!: string;
    @Input() link?: string;
}
