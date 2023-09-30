import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { AppRoutingModule } from '../app-routing.module';
import { CardComponent } from './components/card/card.component';

@NgModule({
    declarations: [LayoutComponent, CardComponent],
    imports: [CommonModule, AppRoutingModule],
    exports: [LayoutComponent, CardComponent],
})
export class UiModule {}
