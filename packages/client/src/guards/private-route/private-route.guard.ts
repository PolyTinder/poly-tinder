import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { LOGIN_ROUTE } from 'src/constants/routes';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';

export const privateRouteGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    return inject(SessionService)
        .isLoggedIn()
        .pipe(
            map((isLoggedIn) => {
                if (!isLoggedIn) {
                    router.navigate([LOGIN_ROUTE]);
                }

                return isLoggedIn;
            }),
        );
};
