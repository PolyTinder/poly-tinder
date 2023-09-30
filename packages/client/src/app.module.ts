import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from 'src/middlewares/api';
import { InitializerService } from 'src/services/initializer-service/initializer.service';
import { HomePageComponent } from 'src/pages/home-page/home-page.component';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { AuthenticationInterceptor } from './middlewares/auth';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
  ],
  providers: [
    InitializerService,
    {
      provide: APP_INITIALIZER,
      useFactory: (initializer: InitializerService) => async () => await initializer.initialize(),
      deps: [InitializerService],
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
