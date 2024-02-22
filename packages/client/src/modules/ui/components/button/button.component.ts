import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/services/notification-service/notification.service';

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
    @Input() interactable: 'default' | 'large' | 'small' | 'none' = 'default';
    @Input() fullWidth: 'never' | 'always' | 'mobile' = 'never';
    @Input() noPadding: boolean = false;
    @Input() forceFocusable: boolean = false;
    @Input() replaceUrl: boolean = false;
    @Output() btnClick: EventEmitter<Event> = new EventEmitter<Event>();

    constructor(
        private readonly router: Router,
        private readonly notificationService: NotificationService,
    ) {}

    onClick(event: Event) {
        if (this.disabled) return;
        this.notificationService.createNotification();

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
            `btn--full-width--${this.fullWidth}`,
            this.isLoading ? 'btn--loading' : '',
            this.disabled ? 'btn--disabled' : '',
            this.iconOnly ? 'btn--icon-only' : '',
            this.noPadding ? 'btn--no-padding' : '',
        ].join(' ');
    }

    get isLinkExternal() {
        return this.link?.startsWith('http');
    }
}
