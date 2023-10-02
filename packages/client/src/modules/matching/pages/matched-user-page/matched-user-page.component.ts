import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    Observable,
    Subject,
    combineLatest,
    first,
    map,
    of,
    switchMap,
} from 'rxjs';
import { PublicProfileService } from '../../services/public-profile-service/public-profile.service';
import { PublicUserResultClass } from '../../models/public-user-result';
import { UserProfile } from 'common/models/user';
import { DisplayMessageGroup, Message } from 'common/models/message';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { groupMessages } from '../../utils/messages';
import { UserProfileService } from 'src/modules/user-profile/services/user-profile-service/user-profile.service';
import { QUESTIONS } from '../../constants/questions';
import { MessagesService } from '../../services/messages-service/messages.service';
import { onlyHasEmoji } from '../../utils/utils';
import { ModerationService } from 'src/modules/moderation/services/moderation.service';
import { MatchingService } from '../../services/matching-service/matching.service';

@Component({
    selector: 'app-matched-user-page',
    templateUrl: './matched-user-page.component.html',
    styleUrls: ['./matched-user-page.component.scss'],
})
export class MatchedUserPageComponent {
    userProfile: Observable<PublicUserResultClass | undefined>;
    messages: Observable<DisplayMessageGroup[]> = new Subject();
    form = new FormGroup({
        message: new FormControl('', [
            Validators.minLength(1),
            Validators.maxLength(255),
        ]),
    });
    question: string;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly publicProfileService: PublicProfileService,
        private readonly userProfileService: UserProfileService,
        private readonly messagesService: MessagesService,
        private readonly moderationService: ModerationService,
        private readonly matchingService: MatchingService,
        private readonly router: Router,
    ) {
        this.userProfile = this.route.params.pipe(
            map((params) => {
                if (!params['id']) {
                    throw new Error('No id provided');
                }

                return Number(params['id']);
            }),
            switchMap((userId) => this.publicProfileService.getMatch(userId)),
        );
        this.messages = combineLatest([
            this.userProfileService.getUserProfile(),
            this.userProfile,
        ]).pipe(
            switchMap(([userProfile, matchedUser]) => {
                if (!userProfile || !matchedUser) return of([]);

                return this.messagesService
                    .getMessages(matchedUser.id)
                    .pipe(
                        map((messages) =>
                            this.groupMessages(
                                messages,
                                userProfile,
                                matchedUser,
                            ),
                        ),
                    );
            }),
        );

        combineLatest([this.messages, this.userProfile]).subscribe(
            ([, userProfile]) => {
                if (!userProfile) return;

                this.messagesService.markAsRead(userProfile.id).subscribe();
            },
        );

        this.publicProfileService.fetchMatchesIfNotLoaded().subscribe();
        this.question = this.getQuestion();
    }

    get userProfileValue(): Observable<UserProfile | undefined> {
        return this.userProfile.pipe(
            switchMap((user) => (user ? user.value : of(undefined))),
        );
    }

    onSubmit() {
        if (this.form.valid) {
            this.sendMessage(this.form.value.message ?? '').subscribe();
            this.form.reset();
        }
    }

    sendMessage(message: string) {
        if (message.length == 0 || message.length > 255) {
            throw new Error('Invalid message length');
        }

        return this.userProfile.pipe(first()).pipe(
            switchMap((user) => {
                if (!user) throw new Error('No user found');
                return this.messagesService.sendMessage(user.id, message);
            }),
        );
    }

    updateQuestion() {
        this.question = this.getQuestion();
    }

    unmatchUser() {
        this.userProfile.pipe(first()).subscribe((user) => {
            if (!user) throw new Error('User profile is undefined');
            this.matchingService.askUnmatchUser(user);
            this.router.navigate(['/matches']);
        });
    }

    reportUser() {
        this.userProfile.pipe(first()).subscribe((user) => {
            if (!user) throw new Error('User profile is undefined');
            this.moderationService.openReportUserModal(
                user.id,
                user.currentValue.name ?? '',
            );
        });
    }

    blockUser() {
        if (!this.userProfile) throw new Error('User profile is undefined');

        this.userProfile.pipe(first()).subscribe((user) => {
            if (!user) throw new Error('User profile is undefined');
            this.moderationService
                .openBlockUserModal(user.id, user.currentValue.name ?? '')
                .subscribe(() => {
                    this.router.navigate(['/matches']);
                });
        });
    }

    private groupMessages(
        messages: Message[],
        userProfile: UserProfile,
        matchedUser: PublicUserResultClass,
    ) {
        return groupMessages(messages).map((messageGroup) => {
            const sender: UserProfile =
                messageGroup.senderId === matchedUser.id
                    ? matchedUser.currentValue
                    : userProfile;
            return {
                timestamp: messageGroup.timestamp,
                sender: {
                    name: sender.name ?? '',
                    picture: sender.pictures?.[0] ?? '',
                },
                isSelf: sender === userProfile,
                messages: messageGroup.messages.map((message) => {
                    return {
                        content: message.content,
                        timestamp: message.timestamp,
                        sender: {
                            name: sender.name ?? '',
                            picture: sender.pictures?.[0] ?? '',
                        },
                        onlyEmoji: onlyHasEmoji(message.content),
                        read: message.read,
                    };
                }),
            };
        });
    }

    private getQuestion(): string {
        return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    }
}
