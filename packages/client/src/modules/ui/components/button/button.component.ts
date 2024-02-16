import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
    @Input() link?: string;
    @Input() linkTarget?: '_blank' | '_self' | '_parent' | '_top';
    @Input() disabled?: boolean;
    @Input() type?: 'button' | 'submit' | 'reset' = 'button';
    @Input() color?: 'default' | 'primary' | 'transparent' | 'danger' =
        'default';
    @Input() icon?: string;
    @Input() iconOnly: boolean = false;
    @Input() isLoading: boolean | null = false;
    @Input() shadow: boolean = false;
    @Input() interactable: 'default' | 'large' | 'small' | 'none' = 'default';
    @Input() forceFocusable: boolean = false;
    @Input() replaceUrl: boolean = false;
    @Output() btnClick: EventEmitter<Event> = new EventEmitter<Event>();

    constructor(private readonly router: Router) {}

    onClick(event: Event) {
        if (this.disabled) return;

        if (this.link) {
            if (this.isLinkExternal) {
                window.open(this.link, this.linkTarget);
            } else {
                this.router.navigate([this.link], {
                    replaceUrl: this.replaceUrl,
                });
            }
        }

        this.btnClick.emit(event);
    }

    get classes() {
        return [
            'btn',
            `btn--style--${this.color}`,
            'interactable' +
                (this.interactable === 'default'
                    ? ''
                    : `--${this.interactable}`),
            this.shadow ? 'btn--shadow' : '',
            this.isLoading ? 'btn--loading' : '',
            this.disabled ? 'btn--disabled' : '',
            this.iconOnly ? 'btn--icon-only' : '',
        ].join(' ');
    }

    get isLinkExternal() {
        return this.link?.startsWith('http');
    }
}
