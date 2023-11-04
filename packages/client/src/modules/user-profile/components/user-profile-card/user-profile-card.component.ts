import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
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
    @ViewChild('container') container!: ElementRef<Element>;
    @Input() userProfile: UserProfile | PublicUserResult | undefined | null =
        null;
    @Input() disableInteractions: boolean = false;
    @Input() disableModeration: boolean = false;
    @Output() excludeUser: EventEmitter<void> = new EventEmitter();
    @Output() likeUser: EventEmitter<void> = new EventEmitter();
    @Output() dislikeUser: EventEmitter<void> = new EventEmitter();

    actionsVisible: boolean = false;
    infoVisible: boolean = false;
    isSwiping: boolean = false;
    initialSwipeX: number | null = null;
    currentSwipeX: number | null = null;
    currentSwipeOutput: 'right' | 'left' | null = null;
    disableSwipe: boolean = false;
    swipingCompleted: boolean = false;

    constructor(private readonly moderationService: ModerationService) {}

    showInfo() {
        this.infoVisible = true;
        this.container.nativeElement.scrollTop =
            this.container.nativeElement.clientHeight * 0.8;
    }

    onScroll(event: Event) {
        const target = event.target as Element | null;

        if (!target) return;

        if (target.scrollTop <= 0) {
            target.scrollTop = 0;
            this.infoVisible = false;
        }

        this.actionsVisible = target.scrollTop >= 90;
    }

    onSwipeStart(event: Event) {
        if (this.disableSwipe) return;
        this.isSwiping = true;
        this.initialSwipeX = (event as MouseEvent).pageX;
    }

    @HostListener('window:mouseup', ['$event'])
    @HostListener('window:touchend', ['$event'])
    onSwipeEnd() {
        if (this.isSwiping) {
            if (this.currentSwipeOutput) {
                this.swipe(this.currentSwipeOutput === 'right');
            }

            this.isSwiping = false;
            this.currentSwipeX = null;
        }
    }

    @HostListener('window:mousemove', ['$event'])
    @HostListener('window:touchmove', ['$event'])
    onSwipeMove(event: MouseEvent) {
        if (!this.isSwiping || this.initialSwipeX === null) return;
        this.currentSwipeX = event.pageX - this.initialSwipeX;

        if (
            this.currentSwipeX >
            this.container.nativeElement.clientWidth * 0.3
        ) {
            this.currentSwipeOutput = 'right';
        } else if (
            this.currentSwipeX <
            -this.container.nativeElement.clientWidth * 0.3
        ) {
            this.currentSwipeOutput = 'left';
        } else {
            this.currentSwipeOutput = null;
        }
    }

    swipe(like: boolean) {
        this.disableSwipe = true;
        this.swipingCompleted = true;
        setTimeout(() => {
            if (like) {
                this.likeUser.emit();
            }
            if (!like) {
                this.dislikeUser.emit();
            }
        }, 250);
    }

    get likeScale() {
        return this.currentSwipeX
            ? Math.min(1.5, Math.max(1, 1 + this.currentSwipeX * 0.001))
            : 1;
    }

    get dislikeScale() {
        return this.currentSwipeX
            ? Math.min(1.5, Math.max(1, 1 + this.currentSwipeX * -0.001))
            : 1;
    }

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

    get shouldDisplayTable() {
        return (
            (this.userProfile?.interests ?? []).length > 0 ||
            (this.userProfile?.associations ?? []).length > 0 ||
            this.userProfile?.zodiacSign ||
            this.userProfile?.sexualOrientation ||
            this.userProfile?.relationshipType ||
            this.userProfile?.lookingFor ||
            this.userProfile?.workout ||
            this.userProfile?.drinking ||
            this.userProfile?.smoking ||
            this.userProfile?.drugs ||
            this.userProfile?.height
        );
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
