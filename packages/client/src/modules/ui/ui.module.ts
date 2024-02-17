import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { CardComponent } from './components/card/card.component';
import { LayoutActionComponent } from './components/layout-action/layout-action.component';
import { ButtonComponent } from './components/button/button.component';
import { RouterModule } from '@angular/router';
import { ImageComponent } from './components/image/image.component';
import { CloudinaryModule } from '@cloudinary/ng';
import { StyleDirective } from './directives/style.directive';

@NgModule({
    declarations: [
        LayoutComponent,
        CardComponent,
        LayoutActionComponent,
        ButtonComponent,
        ImageComponent,
        StyleDirective,
    ],
    imports: [CommonModule, RouterModule, CloudinaryModule],
    exports: [
        LayoutComponent,
        LayoutActionComponent,
        CardComponent,
        ButtonComponent,
        ImageComponent,
        StyleDirective,
    ],
})
export class UiModule {}
