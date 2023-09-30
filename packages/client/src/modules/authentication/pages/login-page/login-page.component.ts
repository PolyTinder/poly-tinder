import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { AuthenticationUser } from 'common/models/authentication';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HOME_ROUTE } from 'src/constants/routes';

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

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly router: Router,
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

        this.authenticationService
            .login(this.loginForm.value as AuthenticationUser)
            .subscribe(() => {
                this.router.navigate([HOME_ROUTE]);
            });
    }
}
