import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfilePageComponent } from './pages/user-profile-page/user-profile-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserProfileFormComponent } from './components/user-profile-form/user-profile-form.component';
import { UserProfileCardComponent } from './components/user-profile-card/user-profile-card.component';
import { ImageModule } from '../image/image.module';

@NgModule({
    declarations: [
        UserProfilePageComponent,
        UserProfileFormComponent,
        UserProfileCardComponent,
    ],
    imports: [CommonModule, ReactiveFormsModule, ImageModule],
    exports: [UserProfilePageComponent, UserProfileCardComponent],
})
export class UserProfileModule {}
