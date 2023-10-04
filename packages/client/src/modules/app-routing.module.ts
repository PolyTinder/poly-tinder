import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './authentication/pages/login-page/login-page.component';
import {
    ABOUT_ROUTE,
    LOGIN_ROUTE,
    MATCHED_USER_ROUTE,
    MATCHES_ROUTE,
    PROFILE_EDIT_ROUTE,
    PROFILE_PREVIEW_ROUTE,
    PROFILE_ROUTE,
    SIGNUP_ROUTE,
    SWIPING_ROUTE,
} from 'src/constants/routes';
import { SignupPageComponent } from './authentication/pages/signup-page/signup-page.component';
import { UserProfilePageComponent } from './user-profile/pages/user-profile-page/user-profile-page.component';
import { MatchesPageComponent } from './matching/pages/matches-page/matches-page.component';
import { SwipingPageComponent } from './matching/pages/swiping-page/swiping-page.component';
import { UserProfileEditPageComponent } from './user-profile/pages/user-profile-edit-page/user-profile-edit-page.component';
import { AboutPageComponent } from './about/pages/about-page/about-page.component';
import { UserProfilePreviewComponent } from './user-profile/pages/user-profile-preview/user-profile-preview.component';
import { MatchedUserPageComponent } from './matching/pages/matched-user-page/matched-user-page.component';

const privateRoute: Route = {
    // canActivate: [privateRouteGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
};

const publicRoute: Route = {
    // canActivate: [publicRouteGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
};

const routes: Routes = [
    { path: SWIPING_ROUTE, component: SwipingPageComponent, ...privateRoute },
    {
        path: PROFILE_ROUTE,
        component: UserProfilePageComponent,
        ...privateRoute,
    },
    {
        path: PROFILE_EDIT_ROUTE,
        component: UserProfileEditPageComponent,
        ...privateRoute,
    },
    {
        path: PROFILE_PREVIEW_ROUTE,
        component: UserProfilePreviewComponent,
        ...privateRoute,
    },
    { path: MATCHES_ROUTE, component: MatchesPageComponent, ...privateRoute },
    {
        path: MATCHED_USER_ROUTE,
        component: MatchedUserPageComponent,
        ...privateRoute,
    },
    { path: ABOUT_ROUTE, component: AboutPageComponent },
    { path: LOGIN_ROUTE, component: LoginPageComponent, ...publicRoute },
    { path: SIGNUP_ROUTE, component: SignupPageComponent, ...publicRoute },
    { path: '**', redirectTo: SWIPING_ROUTE, pathMatch: 'full' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes.map((route) => ({
                ...route,
                path: route.path?.replace(/^\//, ''),
            })),
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
