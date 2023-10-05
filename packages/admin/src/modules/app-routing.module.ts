import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HOME_ROUTE, LOGIN_ROUTE, REPORTS_ROUTE, USER_ROUTE } from 'src/constants/routes';
import { HomePageComponent } from 'src/pages/home-page/home-page.component';
import { LoginPageComponent } from 'src/pages/login-page/login-page.component';
import { ReportsPageComponent } from 'src/pages/reports-page/reports-page.component';
import { UserPageComponent } from 'src/pages/user-page/user-page.component';

const routes: Routes = [
  { path: HOME_ROUTE, component: HomePageComponent, },
  { path: LOGIN_ROUTE, component: LoginPageComponent },
  { path: USER_ROUTE, component: UserPageComponent },
  { path: REPORTS_ROUTE, component: ReportsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes.map((route) => ({
      ...route,
      path: route.path?.replace(/^\//, ''),
    })),
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
