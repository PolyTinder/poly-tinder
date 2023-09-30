import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HOME_ROUTE, LOGIN_ROUTE } from 'src/constants/routes';
import { AuthenticationService } from 'src/modules/authentication/services/authentication-service/authentication.service';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';
import { StateService } from '../state-service/state.service';
import { State } from 'src/constants/states';
import { catchError, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InitializerService {
    constructor(private readonly sessionService: SessionService, private readonly stateService: StateService, private readonly authenticationService: AuthenticationService, private readonly router: Router) {}

    async initialize(): Promise<void> {
        this.authenticationService.loadSession()
            .pipe(
                catchError((err, caugth) => {
                    return of(undefined);
                }),
            )
            .subscribe((session) => {
                if (session) {
                    this.router.navigate([HOME_ROUTE]);
                } else {
                    this.router.navigate([LOGIN_ROUTE]);
                }
                this.stateService.state$.next(State.READY);
            });
    }
}
