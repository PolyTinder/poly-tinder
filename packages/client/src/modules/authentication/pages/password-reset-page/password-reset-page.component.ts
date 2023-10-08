import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-password-reset-page',
    templateUrl: './password-reset-page.component.html',
    styleUrls: ['./password-reset-page.component.scss'],
})
export class PasswordResetPageComponent {
    resetPasswordForm = new FormGroup({
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required]),
    });
    loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    sent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    token: string | undefined = undefined;
    tokenError: Observable<string | undefined>;

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly activatedRoute: ActivatedRoute,
    ) {
        this.activatedRoute.queryParams.subscribe(
            (params) => (this.token = params['token']),
        );
        this.tokenError = this.activatedRoute.queryParams.pipe(
            map((params) =>
                params['token'] ? undefined : "Le token n'est pas valide",
            ),
        );
    }

    onSubmit() {
        if (!this.resetPasswordForm.valid) {
            return;
        }
        if (!this.token) {
            return;
        }

        if (
            this.resetPasswordForm.value.password !==
            this.resetPasswordForm.value.confirmPassword
        ) {
            this.resetPasswordForm.controls.confirmPassword.setErrors({
                passwordMismatch: true,
            });
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
