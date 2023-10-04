import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteUserModalComponent } from './components/delete-user-modal/delete-user-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { UiModule } from '../ui/ui.module';

@NgModule({
    declarations: [DeleteUserModalComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        UiModule,
    ],
})
export class UserModule {}
