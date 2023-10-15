import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-authentication-layout',
    templateUrl: './authentication-layout.component.html',
    styleUrls: ['./authentication-layout.component.scss'],
})
export class AuthenticationLayoutComponent {
    @Input() name!: string;
    @Input() description?: string;
    @Input() formGroup!: FormGroup;
    @Input() formsErrors: Record<string, string> = {};
    @Input() loading: boolean | null = false;
    @Input() disabled: boolean | null = false;

    @Output() formSubmit = new EventEmitter<void>();

    onSubmit(event: Event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (!this.formGroup.valid || this.formGroup.status === 'INVALID') {
            this.formGroup.setErrors({ invalid: true });
            return;
        }

        if (this.formGroup.status !== 'VALID') {
            return;
        }

        this.formGroup.setErrors(null);

        this.formSubmit.emit();
    }
}
