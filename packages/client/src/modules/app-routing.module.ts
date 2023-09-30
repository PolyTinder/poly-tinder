import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { privateRouteGuard } from 'src/guards/private-route/private-route.guard';
import { publicRouteGuard } from 'src/guards/public-route/public-route.guard';
import { HomePageComponent } from 'src/pages/home-page/home-page.component';
import { LoginPageComponent } from './authentication/pages/login-page/login-page.component';
import { HOME_ROUTE, LOGIN_ROUTE, MATCHES_ROUTE, PROFILE_ROUTE, SIGNUP_ROUTE } from 'src/constants/routes';
import { SignupPageComponent } from './authentication/pages/signup-page/signup-page.component';
import { UserProfilePageComponent } from './user-profile/pages/user-profile-page/user-profile-page.component';
import { MatchesPageComponent } from 'src/pages/matches-page/matches-page.component';

const privateRoute: Route = {
  canActivate: [privateRouteGuard],
  runGuardsAndResolvers: 'paramsOrQueryParamsChange',
};

const publicRoute: Route = {
  canActivate: [publicRouteGuard],
  runGuardsAndResolvers: 'paramsOrQueryParamsChange',
};

const routes: Routes = [
  { path: HOME_ROUTE, component: HomePageComponent, ...privateRoute },
  { path: PROFILE_ROUTE, component: UserProfilePageComponent, ...privateRoute },
  { path: MATCHES_ROUTE, component: MatchesPageComponent, ...privateRoute },
  { path: LOGIN_ROUTE, component: LoginPageComponent, ...publicRoute },
  { path: SIGNUP_ROUTE, component: SignupPageComponent, ...publicRoute },
  { path: '**', redirectTo: HOME_ROUTE, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes.map((route) => ({ ...route, path: route.path?.replace(/^\//, '') })))],
  exports: [RouterModule]
})
export class AppRoutingModule { }
