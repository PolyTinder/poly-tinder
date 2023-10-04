import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { AppRoutingModule } from '../app-routing.module';
import { CardComponent } from './components/card/card.component';
import { LayoutActionComponent } from './components/layout-action/layout-action.component';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
    declarations: [
        LayoutComponent,
        CardComponent,
        LayoutActionComponent,
        ButtonComponent,
    ],
    imports: [CommonModule, AppRoutingModule],
    exports: [
        LayoutComponent,
        LayoutActionComponent,
        CardComponent,
        ButtonComponent,
    ],
})
export class UiModule {}
