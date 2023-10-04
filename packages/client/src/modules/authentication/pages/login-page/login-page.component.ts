import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { AuthenticationUser } from 'common/models/authentication';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
    showErrors = new BehaviorSubject<boolean>(false);
    loginForm = new FormGroup({
        email: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
        ]),
        password: new FormControl('', []),
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

        if (!this.loginForm.valid) {
            this.loginForm.setErrors({ invalid: true });
            return;
        }

        this.loginForm.setErrors(null);
        this.loading.next(true);

        this.authenticationService
            .login(this.loginForm.value as AuthenticationUser)
            .subscribe({
                next: () => {
                    this.loading.next(false);
                },
                error: (error: HttpErrorResponse) => {
                    if (error.status === 406) {
                        this.loginForm.setErrors({ invalidCredentials: true });
                    } else {
                        this.loginForm.setErrors({ unknownError: true });
                    }
                    this.loading.next(false);
                },
            });
    }
}
