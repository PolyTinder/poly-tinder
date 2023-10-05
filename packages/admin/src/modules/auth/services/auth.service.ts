import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationUser, UserPublicSession } from 'common/models/authentication';
import { Observable, catchError, of, tap } from 'rxjs';
import { HOME_ROUTE, LOGIN_ROUTE } from 'src/constants/routes';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly userService: UserService, private readonly http: HttpClient, private readonly router: Router) { }

  login(user: AuthenticationUser): Observable<UserPublicSession> {
      return this.http.post<UserPublicSession>('/auth/login?admin=1', user).pipe(
          tap((session) => {
            this.userService.setSession(session);
            this.router.navigate([HOME_ROUTE]);
          }),
      );
  }

  logout(): Observable<void> {
      return this.http.post<void>('/auth/logout', {}).pipe(
          tap(() => {
            this.userService.setSession(undefined);
            this.router.navigate([LOGIN_ROUTE]);
          }),
      );
  }

  loadSession(): Observable<UserPublicSession | undefined> {
      return this.http.post<UserPublicSession | undefined>('/auth/load?admin=1', {}).pipe(
        tap({
            next: (session) => {
              if (session) {
                this.userService.setSession(session);
                this.router.navigate([HOME_ROUTE]);
              } else {
                this.router.navigate([LOGIN_ROUTE]);
              }
            },
            error: (err) => {
              this.router.navigate([LOGIN_ROUTE]);
            },
          }),
          catchError(() => of(undefined)),
      );
  }
}
