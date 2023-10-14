import { Component } from '@angular/core';
import { UserService } from 'src/modules/user/services/user.service';

@Component({
    selector: 'app-user-profile-edit-page',
    templateUrl: './user-profile-edit-page.component.html',
    styleUrls: ['./user-profile-edit-page.component.scss'],
})
export class UserProfileEditPageComponent {
    constructor(private readonly userService: UserService) {}

    askDeleteUser() {
        this.userService.askDeleteUser();
    }
}
