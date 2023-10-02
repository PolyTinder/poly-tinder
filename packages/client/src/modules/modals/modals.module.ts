import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultModalComponent } from './components/default-modal/default-modal.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [DefaultModalComponent],
    imports: [CommonModule, MatDialogModule],
})
export class ModalsModule {}
