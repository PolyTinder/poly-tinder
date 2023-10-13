import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';

@Component({
    selector: 'app-request-password-reset-page',
    templateUrl: './request-password-reset-page.component.html',
    styleUrls: ['./request-password-reset-page.component.scss'],
})
export class RequestPasswordResetPageComponent {
    requestResetPasswordForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });
    loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    sent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    onSubmit() {
        this.loading.next(true);
        this.authenticationService
            .requestPasswordReset(
                this.requestResetPasswordForm.value.email ?? '',
            )
            .subscribe({
                next: () => {
                    this.loading.next(false);
                    this.requestResetPasswordForm.reset();
                    this.sent.next(true);
                },
                error: () => {
                    this.requestResetPasswordForm.setErrors({
                        unknownError: true,
                    });
                    this.loading.next(false);
                },
            });
    }
}
