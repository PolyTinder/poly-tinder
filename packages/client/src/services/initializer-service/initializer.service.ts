import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    HOME_ROUTE,
    LOGIN_ROUTE,
    PUBLICLY_ACCESSIBLE_ROUTES_PATH,
    PUBLIC_ROUTES_PATH,
} from 'src/constants/routes';
import { AuthenticationService } from 'src/modules/authentication/services/authentication-service/authentication.service';
import { StateService } from '../state-service/state.service';
import { State } from 'src/constants/states';
import { catchError, of } from 'rxjs';
import { WsService } from '../ws-service/ws.service';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';

@Injectable({
    providedIn: 'root',
})
export class InitializerService {
    constructor(
        private readonly stateService: StateService,
        private readonly authenticationService: AuthenticationService,
        private readonly sessionService: SessionService,
        private readonly router: Router,
        private readonly wsService: WsService,
    ) {}

    async initialize(): Promise<void> {
        this.authenticationService
            .loadSession()
            .pipe(
                catchError(() => {
                    return of(undefined);
                }),
            )
            .subscribe((session) => {
                if (session) {
                    if (PUBLIC_ROUTES_PATH.includes(this.router.url)) {
                        this.router.navigate([HOME_ROUTE]);
                    }

                    this.wsService.connect(session.token).subscribe({
                        next: () => {
                            this.stateService.state$.next(State.READY);
                        },
                        error: () => {
                            this.stateService.state$.next(State.ERROR);
                        },
                    });
                } else {
                    if (
                        !PUBLICLY_ACCESSIBLE_ROUTES_PATH.find((route) =>
                            this.router.url.startsWith(route),
                        )
                    ) {
                        this.router.navigate([LOGIN_ROUTE]);
                    }
                    this.stateService.state$.next(State.READY);
                }
            });

        this.wsService.ws.subscribe((ws) => {
            if (
                !ws &&
                this.stateService.state$.value === State.READY &&
                this.sessionService.isCurrentlyLoggedIn()
            ) {
                this.stateService.state$.next(State.ERROR);
            }
        });
    }
}
