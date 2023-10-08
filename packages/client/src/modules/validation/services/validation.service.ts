import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserValidationResponse } from 'common/models/user';
import {
    BehaviorSubject,
    Observable,
    catchError,
    map,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';
import { WsService } from 'src/services/ws-service/ws.service';

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    private userValid$: BehaviorSubject<UserValidationResponse | undefined> =
        new BehaviorSubject<UserValidationResponse | undefined>(undefined);

    constructor(
        private readonly wsService: WsService,
        private readonly http: HttpClient,
        private readonly sessionService: SessionService,
        private readonly snackBar: MatSnackBar,
    ) {
        this.wsService
            .listen('user-validation:update')
            .subscribe((userValid) => {
                this.userValid$.next(userValid);
            });

        this.sessionService.isLoggedIn().subscribe((isLoggedIn) => {
            if (isLoggedIn) {
                this.fetchValidation().subscribe();
            } else {
                this.userValid$.next(undefined);
            }
        });
    }

    get userValid(): Observable<boolean | undefined> {
        return this.userValid$.pipe(
            map((userValid) =>
                userValid
                    ? Boolean(
                          userValid.emailValidated &&
                              userValid.userProfileReady,
                      )
                    : undefined,
            ),
        );
    }

    get userValidActionsCount(): Observable<number | undefined> {
        return this.userValid$.pipe(
            map((userValid) =>
                userValid
                    ? (userValid.emailValidated ? 0 : 1) +
                      (userValid.userProfileReady ? 0 : 1)
                    : undefined,
            ),
        );
    }

    get userValidMessage(): Observable<string | undefined> {
        return this.userValid$.pipe(
            map((userValid) => {
                if (!userValid) return undefined;

                if (!userValid.emailValidated) {
                    return 'Veuillez vérifier votre email';
                }

                if (!userValid.userProfileReady) {
                    return 'Veuillez compléter votre profil';
                }

                return undefined;
            }),
        );
    }

    get userProfileReady(): Observable<boolean | undefined> {
        return this.userValid$.pipe(
            map((userValid) =>
                userValid ? Boolean(userValid.userProfileReady) : undefined,
            ),
        );
    }

    get emailValidated(): Observable<boolean | undefined> {
        return this.userValid$.pipe(
            map((userValid) =>
                userValid ? Boolean(userValid.emailValidated) : undefined,
            ),
        );
    }

    validateEmail(token: string): Observable<UserValidationResponse> {
        return this.http.post<void>('/user-validation/email', { token }).pipe(
            map(() =>
                this.snackBar.open('Email vérifié !', 'OK', { duration: 5000 }),
            ),
            catchError(() => {
                this.snackBar.open(
                    'Erreur lors de la vérification du email',
                    'OK',
                    { duration: 5000 },
                );
                return of(undefined);
            }),
            switchMap(() => this.fetchValidation()),
        );
    }

    requestEmailValidation(): Observable<UserValidationResponse> {
        return this.http.post<void>('/user-validation/email/request', {}).pipe(
            map(() =>
                this.snackBar.open('Email de vérification envoyé !', 'OK', {
                    duration: 5000,
                }),
            ),
            catchError(() => {
                this.snackBar.open(
                    "Erreur lors de l'envoi du email de vérification",
                    'OK',
                    { duration: 5000 },
                );
                return of(undefined);
            }),
            switchMap(() => this.fetchValidation()),
        );
    }

    private fetchValidation(): Observable<UserValidationResponse> {
        return this.http
            .get<UserValidationResponse>('/user-validation')
            .pipe(tap((userValid) => this.userValid$.next(userValid)));
    }
}
