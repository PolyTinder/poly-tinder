import { Component } from '@angular/core';
import { UserProfileService } from '../../services/user-profile-service/user-profile.service';

@Component({
    selector: 'app-user-profile-page',
    templateUrl: './user-profile-page.component.html',
    styleUrls: ['./user-profile-page.component.scss']
})
export class UserProfilePageComponent {
    constructor(private readonly userProfileService: UserProfileService) {}

    get userProfile() {
        return this.userProfileService.getUserProfile();
    }
}
