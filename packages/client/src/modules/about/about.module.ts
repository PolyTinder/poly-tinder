import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { UiModule } from '../ui/ui.module';
import { AppRoutingModule } from '../app-routing.module';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { AcceptableUsePolicyComponent } from './pages/acceptable-use-policy/acceptable-use-policy.component';

@NgModule({
    declarations: [
        AboutPageComponent,
        PrivacyPolicyComponent,
        TermsAndConditionsComponent,
        AcceptableUsePolicyComponent,
    ],
    imports: [CommonModule, UiModule, AppRoutingModule],
    exports: [
        AboutPageComponent,
        PrivacyPolicyComponent,
        TermsAndConditionsComponent,
        AcceptableUsePolicyComponent,
    ],
})
export class AboutModule {}
