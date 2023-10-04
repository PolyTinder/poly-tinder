import { Component, EventEmitter, Input, Output } from '@angular/core';

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
    @Input() color?: 'default' | 'primary' | 'danger' = 'default';
    @Input() icon?: string;
    @Input() isLoading: boolean | null = false;
    @Input() shadow: boolean = false;
    @Input() interactable: 'default' | 'large' | 'small' = 'default';
    @Output() btnClick: EventEmitter<Event> = new EventEmitter<Event>();

    onClick(event: Event) {
        if (this.disabled) return;

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
        ].join(' ');
    }

    get isLinkExternal() {
        return this.link?.startsWith('http');
    }
}
