import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
        password: new FormControl('', [Validators.required]),
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
            return;
        }
        if (!this.deleteUserForm.value.password) {
            return;
        }

        this.loading$.next(true);
        return this.userService
            .deleteUser(this.deleteUserForm.value.password)
            .pipe(
                tap({
                    next: () => this.ref.close(),
                    error: () => {
                        this.loading$.next(false);
                    },
                }),
            );
    }

    onCancel(event: Event) {
        event.preventDefault();
        this.ref.close();
    }
}
