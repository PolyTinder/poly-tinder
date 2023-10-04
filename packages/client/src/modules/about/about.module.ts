import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { UiModule } from '../ui/ui.module';
import { AppRoutingModule } from '../app-routing.module';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

@NgModule({
    declarations: [AboutPageComponent, PrivacyPolicyComponent],
    imports: [CommonModule, UiModule, AppRoutingModule],
    exports: [AboutPageComponent, PrivacyPolicyComponent],
})
export class AboutModule {}
