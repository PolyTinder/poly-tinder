import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { AppRoutingModule } from '../app-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UiModule } from '../ui/ui.module';

@NgModule({
    declarations: [LoginPageComponent, SignupPageComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        UiModule,
    ],
    exports: [LoginPageComponent, SignupPageComponent],
})
export class AuthenticationModule {}
