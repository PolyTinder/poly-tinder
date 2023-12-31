import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from 'src/middlewares/api';
import { InitializerService } from 'src/services/initializer-service/initializer.service';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { AuthenticationInterceptor } from './middlewares/auth';
import { NavigationComponent } from './components/navigation/navigation.component';
import { UserProfileModule } from './modules/user-profile/user-profile.module';
import { MatchingModule } from './modules/matching/matching.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AboutModule } from './modules/about/about.module';
import { StatusPageComponent } from './components/status-page/status-page.component';
import { UserModule } from './modules/user/user.module';
import { UiModule } from './modules/ui/ui.module';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
    declarations: [AppComponent, NavigationComponent, StatusPageComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AuthenticationModule,
        UserProfileModule,
        MatchingModule,
        AboutModule,
        BrowserAnimationsModule,
        MatTooltipModule,
        MatMenuModule,
        UserModule,
        UiModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
    providers: [
        InitializerService,
        {
            provide: APP_INITIALIZER,
            useFactory: (initializer: InitializerService) => async () =>
                await initializer.initialize(),
            deps: [InitializerService],
            multi: true,
        },
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
