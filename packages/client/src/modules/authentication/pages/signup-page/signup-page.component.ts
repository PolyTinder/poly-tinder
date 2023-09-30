import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { AuthenticationUser } from 'common/models/authentication';
import { HOME_ROUTE } from 'src/constants/routes';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent {
    showErrors = new BehaviorSubject<boolean>(false);
    signupForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.minLength(1)]),
        password: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });
  
    constructor(private readonly authenticationService: AuthenticationService, private readonly router: Router) {}

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

      this.authenticationService
          .signup(this.signupForm.value as AuthenticationUser)
          .pipe(
            catchError((err: HttpErrorResponse, caugth) => {
                this.signupForm.setErrors({ validation: err.error.message })

                return of(undefined);
            }),
          )
          .subscribe((session) => {
                if(session) {
                    this.router.navigate([HOME_ROUTE]);
                }
          });
    }
}
