import { Component } from '@angular/core';
import { UserProfileService } from '../../services/user-profile-service/user-profile.service';
import { AuthenticationService } from 'src/modules/authentication/services/authentication-service/authentication.service';
import { ValidationService } from 'src/modules/validation/services/validation.service';
import { UserService } from 'src/modules/user/services/user.service';

@Component({
    selector: 'app-user-profile-page',
    templateUrl: './user-profile-page.component.html',
    styleUrls: ['./user-profile-page.component.scss'],
})
export class UserProfilePageComponent {
    constructor(
        private readonly userProfileService: UserProfileService,
        private readonly authenticationService: AuthenticationService,
        private readonly validationService: ValidationService,
        private readonly userService: UserService,
    ) {}

    get userProfile() {
        return this.userProfileService.getUserProfile();
    }

    get userValid() {
        return this.validationService.userProfileReady;
    }

    logout() {
        this.authenticationService.logout().subscribe();
    }

    askDeleteUser() {
        this.userService.askDeleteUser();
    }
}
