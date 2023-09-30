import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { LOGIN_ROUTE } from 'src/constants/routes';
import { State } from 'src/constants/states';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';
import { StateService } from 'src/services/state-service/state.service';

export const privateRouteGuard: CanActivateFn = () => {
    const router = inject(Router);
    const sessionService = inject(SessionService);
    const stateService = inject(StateService);

    return combineLatest([
        sessionService.isLoggedIn(),
        stateService.state$,
    ]).pipe(
        map(([isLoggedIn, state]) => {
            if (state !== State.READY) {
                return true;
            }

            if (!isLoggedIn) {
                router.navigate([LOGIN_ROUTE]);
            }

            return isLoggedIn;
        }),
    );
};
