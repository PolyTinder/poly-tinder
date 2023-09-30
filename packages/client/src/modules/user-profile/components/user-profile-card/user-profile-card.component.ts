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

    get interests(): string[] | undefined {
        const interests = this.userProfile?.interests?.filter((interest) => interest.length > 0);

        return (interests?.length ?? 0) > 0 ? interests : undefined;
    }

    get associations(): string[] | undefined {
        const associations = this.userProfile?.associations?.filter((association) => association.length > 0);

        return (associations?.length ?? 0) > 0 ? associations : undefined;
    }
}
