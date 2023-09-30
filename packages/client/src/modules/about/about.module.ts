import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { UiModule } from '../ui/ui.module';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
    declarations: [AboutPageComponent],
    imports: [CommonModule, UiModule, AppRoutingModule],
    exports: [AboutPageComponent],
})
export class AboutModule {}
