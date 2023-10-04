import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, tap } from 'rxjs';
import { AuthenticationService } from 'src/modules/authentication/services/authentication-service/authentication.service';
import { DeleteUserModalComponent } from '../components/delete-user-modal/delete-user-modal.component';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(
        private readonly http: HttpClient,
        private readonly authenticationService: AuthenticationService,
        private readonly dialog: MatDialog,
    ) {}

    askDeleteUser() {
        this.dialog.open(DeleteUserModalComponent);
    }

    deleteUser(password: string): Observable<void> {
        return this.http
            .delete<void>('/user', {
                body: { password },
            })
            .pipe(
                tap(() => {
                    this.authenticationService.logout(true);
                }),
            );
    }
}
