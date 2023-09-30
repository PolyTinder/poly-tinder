import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
    declarations: [LoginPageComponent, SignupPageComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRoutingModule,
    ],
    exports: [LoginPageComponent, SignupPageComponent],
})
export class AuthenticationModule {}
