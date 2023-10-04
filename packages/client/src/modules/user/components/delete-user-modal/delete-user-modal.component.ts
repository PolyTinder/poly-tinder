import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, tap } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-delete-user-modal',
    templateUrl: './delete-user-modal.component.html',
    styleUrls: ['./delete-user-modal.component.scss'],
})
export class DeleteUserModalComponent {
    private loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false,
    );
    deleteUserForm = new FormGroup({
        password: new FormControl('', []),
    });

    constructor(
        private readonly ref: MatDialogRef<DeleteUserModalComponent>,
        private readonly userService: UserService,
    ) {}

    get loading() {
        return this.loading$.asObservable();
    }

    onSubmit() {
        if (this.deleteUserForm.invalid) {
            throw new Error('Invalid form');
        }

        this.loading$.next(true);
        this.userService
            .deleteUser(this.deleteUserForm.value.password ?? '')
            .pipe(
                tap({
                    next: () => this.ref.close(),
                    error: () => {
                        this.loading$.next(false);
                    },
                }),
            )
            .subscribe();
    }

    onCancel(event: Event) {
        event.preventDefault();
        this.ref.close();
    }
}
