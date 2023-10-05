import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private readonly authService: AuthService) {}

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loginForm.setErrors(null);

    this.authService.login({
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? '',
    }).subscribe({
      next: () => {
        console.log('Logged in')
      },
      error: (e) => {
        console.log('error', e);
        this.loginForm.setErrors({ invalidCredentials: true });
      }
    });
  }
}
