import { Routes } from '@angular/router';
import {
    ABOUT_ROUTE,
    ACCEPTABLE_USE_POLICY_ROUTE,
    AID_ORGANIZATIONS_ROUTE,
    HOW_TO_BLOCK_ROUTE,
    HOW_TO_REPORT_ROUTE,
    HOW_TO_UNMATCH_ROUTE,
    INCLUSIVITY_ROUTE,
    POLICIES_ROUTE,
    PRIVACY_POLICY_ROUTE,
    RULES_ROUTE,
    TERMS_AND_CONDITIONS_ROUTE,
} from './constants/routes';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { GeneralRulesPageComponent } from './pages/application-rules/general-rules-page/general-rules-page.component';
import { PoliciesPageComponent } from './pages/application-rules/policies-page/policies-page.component';
import { PrivacyPolicyComponent } from './pages/application-rules/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './pages/application-rules/terms-and-conditions/terms-and-conditions.component';
import { AcceptableUsePolicyComponent } from './pages/application-rules/acceptable-use-policy/acceptable-use-policy.component';
import { HowToReportPageComponent } from './pages/security/how-to-report-page/how-to-report-page.component';
import { HowToBlockPageComponent } from './pages/security/how-to-block-page/how-to-block-page.component';
import { HowToUnmatchComponent } from './pages/security/how-to-unmatch/how-to-unmatch.component';
import { InclusivityPageComponent } from './pages/ressources/inclusivity-page/inclusivity-page.component';
import { AidOrganizationsPageComponent } from './pages/ressources/aid-organizations-page/aid-organizations-page.component';

const routes: Routes = [
    { path: ABOUT_ROUTE, component: AboutPageComponent },

    { path: RULES_ROUTE, component: GeneralRulesPageComponent },
    { path: POLICIES_ROUTE, component: PoliciesPageComponent },
    { path: PRIVACY_POLICY_ROUTE, component: PrivacyPolicyComponent },
    {
        path: TERMS_AND_CONDITIONS_ROUTE,
        component: TermsAndConditionsComponent,
    },
    {
        path: ACCEPTABLE_USE_POLICY_ROUTE,
        component: AcceptableUsePolicyComponent,
    },

    { path: HOW_TO_REPORT_ROUTE, component: HowToReportPageComponent },
    { path: HOW_TO_BLOCK_ROUTE, component: HowToBlockPageComponent },
    { path: HOW_TO_UNMATCH_ROUTE, component: HowToUnmatchComponent },

    { path: INCLUSIVITY_ROUTE, component: InclusivityPageComponent },
    { path: AID_ORGANIZATIONS_ROUTE, component: AidOrganizationsPageComponent },

    { path: ABOUT_ROUTE + '**', redirectTo: ABOUT_ROUTE },
];

export const aboutRoutes = routes.map((route) => ({
    ...route,
    path: route.path?.replace(/^\//, ''),
}));
