import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { CardComponent } from './components/card/card.component';
import { LayoutActionComponent } from './components/layout-action/layout-action.component';
import { ButtonComponent } from './components/button/button.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        LayoutComponent,
        CardComponent,
        LayoutActionComponent,
        ButtonComponent,
    ],
    imports: [CommonModule, RouterModule],
    exports: [
        LayoutComponent,
        LayoutActionComponent,
        CardComponent,
        ButtonComponent,
    ],
})
export class UiModule {}
