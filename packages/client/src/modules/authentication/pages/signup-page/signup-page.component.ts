import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { AuthenticationUser } from 'common/models/authentication';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Component({
    selector: 'app-signup-page',
    templateUrl: './signup-page.component.html',
    styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent {
    showErrors = new BehaviorSubject<boolean>(false);
    signupForm = new FormGroup({
        email: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
        ]),
        privacyPolicy: new FormControl(false, [Validators.requiredTrue]),
    });
    loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    onChange() {
        this.showErrors.next(false);
    }

    onSubmit() {
        this.showErrors.next(true);

        if (!this.signupForm.valid) {
            this.signupForm.setErrors({ invalid: true });
            return;
        }

        this.signupForm.setErrors(null);
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
                    } else {
                        this.signupForm.setErrors({ unknownError: true });
                    }
                    this.loading.next(false);
                },
            });
    }
}
