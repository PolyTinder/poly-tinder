import { Component, Input } from '@angular/core';
import { PublicUserResult, UserProfile } from 'common/models/user';

@Component({
    selector: 'app-user-profile-card',
    templateUrl: './user-profile-card.component.html',
    styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent {
    @Input() userProfile: UserProfile | PublicUserResult | undefined | null =
        null;
}
