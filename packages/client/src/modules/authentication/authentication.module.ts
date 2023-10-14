import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UiModule } from '../ui/ui.module';
import { RequestPasswordResetPageComponent } from './pages/request-password-reset-page/request-password-reset-page.component';
import { PasswordResetPageComponent } from './pages/password-reset-page/password-reset-page.component';
import { AuthenticationLayoutComponent } from './components/authentication-layout/authentication-layout.component';

@NgModule({
    declarations: [
        LoginPageComponent,
        SignupPageComponent,
        RequestPasswordResetPageComponent,
        PasswordResetPageComponent,
        AuthenticationLayoutComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        UiModule,
    ],
    exports: [
        LoginPageComponent,
        SignupPageComponent,
        RequestPasswordResetPageComponent,
        PasswordResetPageComponent,
    ],
})
export class AuthenticationModule {}
