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
import { combineLatest } from 'rxjs';
import { WsService } from '../ws-service/ws.service';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';
import { UserPublicSession } from 'common/models/authentication';
import { Location } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class InitializerService {
    constructor(
        private readonly stateService: StateService,
        private readonly authenticationService: AuthenticationService,
        private readonly sessionService: SessionService,
        private readonly router: Router,
        private readonly location: Location,
        private readonly wsService: WsService,
    ) {}

    async initialize(): Promise<void> {
        this.stateService.setLoading();

        combineLatest([
            this.sessionService.session$,
            this.wsService.disconnect$,
        ]).subscribe({
            next: ([session]) => {
                if (session) {
                    this.stateService.setLoading();
                } else {
                    this.stateService.setReady();
                }
            },
            error: (error) => {
                this.stateService.setError(error);
            },
        });

        this.wsService.ws.subscribe((ws) => {
            if (ws) {
                this.stateService.setReady();
            }
        });

        this.authenticationService.loadSession().subscribe((session) => {
            if (session) {
                this.wsService.connect(session.token).subscribe();
            } else {
                this.stateService.setReady();
            }
            this.handleRedirect(session);
        });
    }

    handleRedirect(session: UserPublicSession | undefined): void {
        if (session && PUBLIC_ROUTES_PATH.includes(this.location.path())) {
            this.router.navigate([HOME_ROUTE]);
        }

        if (
            !session &&
            !PUBLICLY_ACCESSIBLE_ROUTES_PATH.includes(this.location.path())
        ) {
            this.router.navigate([LOGIN_ROUTE]);
        }
    }
}
