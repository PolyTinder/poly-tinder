import { Component } from '@angular/core';
import { UserProfileService } from '../../services/user-profile-service/user-profile.service';

@Component({
    selector: 'app-user-profile-preview',
    templateUrl: './user-profile-preview.component.html',
    styleUrls: ['./user-profile-preview.component.scss'],
})
export class UserProfilePreviewComponent {
    constructor(private readonly userProfileService: UserProfileService) {}

    get userProfile() {
        return this.userProfileService.getUserProfile();
    }
}
