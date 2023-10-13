import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { confirmPasswordValidator } from '../../validators/confirm-password-validator';

@Component({
    selector: 'app-password-reset-page',
    templateUrl: './password-reset-page.component.html',
    styleUrls: ['./password-reset-page.component.scss'],
})
export class PasswordResetPageComponent {
    resetPasswordForm = new FormGroup({
        password: new FormControl('', [
            Validators.required,
            Validators.pattern(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
            ),
            Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [
            Validators.required,
            confirmPasswordValidator(),
        ]),
    });
    loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    sent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    token: string | undefined = undefined;

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly activatedRoute: ActivatedRoute,
    ) {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.token = params['token'];
        });
    }

    onSubmit() {
        if (!this.token) {
            return;
        }

        this.loading.next(true);
        this.authenticationService
            .resetPassword(this.token, this.resetPasswordForm.value.password!)
            .subscribe({
                next: () => {
                    this.loading.next(false);
                    this.resetPasswordForm.reset();
                    this.sent.next(true);
                },
                error: () => {
                    this.resetPasswordForm.setErrors({
                        unknownError: true,
                    });
                    this.loading.next(false);
                },
            });
    }
}
