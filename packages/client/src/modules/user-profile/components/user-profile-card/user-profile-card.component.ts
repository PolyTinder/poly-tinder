import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PublicUserResult, UserProfile } from 'common/models/user';
import {
    LOOKING_FOR,
    RELATIONSHIP_TYPES,
    ZODIAC_SIGNS,
    SEXUAL_ORIENTATIONS,
    PROGRAMS,
    WORKOUT_HABITS,
    DRINKING_HABITS,
    SMOKING_HABITS,
} from '../../constants';
import { ModerationService } from 'src/modules/moderation/services/moderation.service';

@Component({
    selector: 'app-user-profile-card',
    templateUrl: './user-profile-card.component.html',
    styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent {
    @Input() userProfile: UserProfile | PublicUserResult | undefined | null =
        null;
    @Input() disableModeration: boolean = false;
    @Output() excludeUser: EventEmitter<void> = new EventEmitter();

    constructor(private readonly moderationService: ModerationService) {}

    get program() {
        return this.userProfile?.program
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (PROGRAMS as any)[this.userProfile?.program]
            : undefined;
    }

    get interests(): string[] | undefined {
        const interests = this.userProfile?.interests?.filter(
            (interest) => interest.length > 0,
        );

        return (interests?.length ?? 0) > 0 ? interests : undefined;
    }

    get associations(): string[] | undefined {
        const associations = this.userProfile?.associations?.filter(
            (association) => association.length > 0,
        );

        return (associations?.length ?? 0) > 0 ? associations : undefined;
    }

    get zodiacSign() {
        return ZODIAC_SIGNS.find(
            (zodiac) => zodiac.id === this.userProfile?.zodiacSign,
        );
    }

    get sexualOrientation() {
        return SEXUAL_ORIENTATIONS.find(
            (orientation) =>
                orientation.id === this.userProfile?.sexualOrientation,
        );
    }

    get relationshipType() {
        return RELATIONSHIP_TYPES.find(
            (status) => status.id === this.userProfile?.relationshipType,
        );
    }

    get lookingFor() {
        return LOOKING_FOR.find(
            (lookingFor) => lookingFor.id === this.userProfile?.lookingFor,
        );
    }

    get workout() {
        return WORKOUT_HABITS.find(
            (workout) => workout.id === this.userProfile?.workout,
        );
    }

    get drinking() {
        return DRINKING_HABITS.find(
            (drinking) => drinking.id === this.userProfile?.drinking,
        );
    }

    get smoking() {
        return SMOKING_HABITS.find(
            (smoking) => smoking.id === this.userProfile?.smoking,
        );
    }

    get drugs() {
        return DRINKING_HABITS.find(
            (drugs) => drugs.id === this.userProfile?.drugs,
        );
    }

    get height() {
        if (!this.userProfile?.height) {
            return undefined;
        }

        const heightCm = this.userProfile.height;
        const heightFeet = Math.floor(heightCm / 30.48);
        const heightInches = Math.round((heightCm % 30.48) / 2.54);

        return `${heightCm} cm / ${heightFeet}'${heightInches}"`;
    }

    reportUser() {
        if (!this.userProfile) throw new Error('User profile is undefined');

        this.moderationService.openReportUserModal(
            this.userProfile.userId,
            this.userProfile.name ?? '',
        );
    }

    blockUser() {
        if (!this.userProfile) throw new Error('User profile is undefined');

        this.moderationService
            .openBlockUserModal(
                this.userProfile.userId,
                this.userProfile.name ?? '',
            )
            .subscribe(() => {
                this.excludeUser.emit();
            });
    }
}
