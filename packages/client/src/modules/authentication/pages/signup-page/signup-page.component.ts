import { Component } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { AuthenticationUser } from 'common/models/authentication';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { confirmPasswordValidator } from '../../validators/confirm-password-validator';
import disposableEmailDomains from 'disposable-email-domains';

@Component({
    selector: 'app-signup-page',
    templateUrl: './signup-page.component.html',
    styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent {
    signupForm = new FormGroup({
        email: new FormControl('', [
            Validators.required,
            Validators.email,
            this.disposableEmailValidator,
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.pattern(/.+[a-z]+.+/), // letters,
            Validators.pattern(/.+[0-9]+.+/), // numbers,
            Validators.pattern(/.+[!@#$%?&*()-_=+/\\|,.;:^¨~<>[\]{}]+.+/), // symbols,
            Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [
            Validators.required,
            confirmPasswordValidator(),
        ]),
        privacyPolicy: new FormControl(false, [Validators.requiredTrue]),
    });
    loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    onSubmit() {
        this.loading.next(true);

        this.authenticationService
            .signup(this.signupForm.value as AuthenticationUser)
            .subscribe({
                next: () => {
                    this.loading.next(false);
                },
                error: (e: HttpErrorResponse) => {
                    if (e.status === HttpStatusCode.Conflict) {
                        this.signupForm.setErrors({ conflict: true });
                    } else if (e.status === HttpStatusCode.Locked) {
                        this.signupForm.setErrors({ accountLocked: true });
                    } else {
                        this.signupForm.setErrors({ unknownError: true });
                    }
                    this.loading.next(false);
                },
            });
    }

    private disposableEmailValidator(control: AbstractControl) {
        if (
            control.value &&
            disposableEmailDomains.find((d) =>
                control.value.trim().toLowerCase().endsWith(d),
            )
        ) {
            return { disposableEmail: true };
        }

        return null;
    }
}
