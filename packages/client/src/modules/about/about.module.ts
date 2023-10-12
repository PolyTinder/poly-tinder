import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { UiModule } from '../ui/ui.module';
import { AppRoutingModule } from '../app-routing.module';
import { PrivacyPolicyComponent } from './pages/application-rules/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './pages/application-rules/terms-and-conditions/terms-and-conditions.component';
import { AcceptableUsePolicyComponent } from './pages/application-rules/acceptable-use-policy/acceptable-use-policy.component';
import { AboutCardComponent } from './components/about-card/about-card.component';
import { AboutLayoutComponent } from './components/about-layout/about-layout.component';
import { GeneralRulesPageComponent } from './pages/application-rules/general-rules-page/general-rules-page.component';
import { PoliciesPageComponent } from './pages/application-rules/policies-page/policies-page.component';
import { HowToReportPageComponent } from './pages/security/how-to-report-page/how-to-report-page.component';
import { HowToBlockPageComponent } from './pages/security/how-to-block-page/how-to-block-page.component';
import { HowToUnmatchComponent } from './pages/security/how-to-unmatch/how-to-unmatch.component';
import { InclusivityPageComponent } from './pages/ressources/inclusivity-page/inclusivity-page.component';
import { AidOrganizationsPageComponent } from './pages/ressources/aid-organizations-page/aid-organizations-page.component';
import { ConsentPageComponent } from './pages/ressources/consent-page/consent-page.component';

@NgModule({
    declarations: [
        AboutPageComponent,
        PrivacyPolicyComponent,
        TermsAndConditionsComponent,
        AcceptableUsePolicyComponent,
        AboutCardComponent,
        AboutLayoutComponent,
        GeneralRulesPageComponent,
        PoliciesPageComponent,
        HowToReportPageComponent,
        HowToBlockPageComponent,
        HowToUnmatchComponent,
        InclusivityPageComponent,
        AidOrganizationsPageComponent,
        ConsentPageComponent,
    ],
    imports: [CommonModule, UiModule, AppRoutingModule],
    exports: [],
})
export class AboutModule {}
