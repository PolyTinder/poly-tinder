import { Component, Input } from '@angular/core';
import { PublicUserResult, UserProfile } from 'common/models/user';
import { ZODIAC_SIGNS } from '../../constants/zodiac';
import { SEXUAL_ORIENTATIONS } from '../../constants/gender';
import { RELATIONSHIP_TYPES } from '../../constants/relationship-type';
import { PROGRAMS } from '../../constants/programs';
import { LOOKING_FOR } from '../../constants/looking-for';

@Component({
    selector: 'app-user-profile-card',
    templateUrl: './user-profile-card.component.html',
    styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent {
    @Input() userProfile: UserProfile | PublicUserResult | undefined | null =
        null;
    
    get program() {
        return this.userProfile?.program ? (PROGRAMS as any)[this.userProfile?.program] : undefined;
    }

    get interests(): string[] | undefined {
        const interests = this.userProfile?.interests?.filter((interest) => interest.length > 0);

        return (interests?.length ?? 0) > 0 ? interests : undefined;
    }

    get associations(): string[] | undefined {
        const associations = this.userProfile?.associations?.filter((association) => association.length > 0);

        return (associations?.length ?? 0) > 0 ? associations : undefined;
    }

    get zodiacSign() {
        return ZODIAC_SIGNS.find((zodiac) => zodiac.id === this.userProfile?.zodiacSign);
    }

    get sexualOrientation() {
        return SEXUAL_ORIENTATIONS.find((orientation) => orientation.id === this.userProfile?.sexualOrientation);
    }

    get relationshipType() {
        return RELATIONSHIP_TYPES.find((status) => status.id === this.userProfile?.relationshipType);
    }

    get lookingFor() {
        return LOOKING_FOR.find((lookingFor) => lookingFor.id === this.userProfile?.lookingFor);
    }
}
