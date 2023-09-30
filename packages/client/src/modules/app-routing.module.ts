import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { privateRouteGuard } from 'src/guards/private-route/private-route.guard';
import { publicRouteGuard } from 'src/guards/public-route/public-route.guard';
import { HomePageComponent } from 'src/pages/home-page/home-page.component';
import { LoginPageComponent } from './authentication/pages/login-page/login-page.component';
import { HOME_ROUTE, LOGIN_ROUTE } from 'src/constants/routes';

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
  { path: LOGIN_ROUTE, component: LoginPageComponent, ...publicRoute },
  { path: '**', redirectTo: HOME_ROUTE, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes.map((route) => ({ ...route, path: route.path?.replace(/^\//, '') })))],
  exports: [RouterModule]
})
export class AppRoutingModule { }
