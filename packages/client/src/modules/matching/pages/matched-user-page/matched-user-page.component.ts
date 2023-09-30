import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, combineLatest, map, of, switchMap } from 'rxjs';
import { PublicProfileService } from '../../services/public-profile-service/public-profile.service';
import { PublicUserResultClass } from '../../models/public-user-result';
import { UserProfile } from 'common/models/user';
import {
    DisplayMessageGroup,
    Message,
} from 'common/models/message';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { groupMessages } from '../../utils/messages';
import { UserProfileService } from 'src/modules/user-profile/services/user-profile-service/user-profile.service';
import { QUESTIONS } from '../../constants/questions';

const MESSAGES: Message[] = [
    // {
    //     content: 'Hey!',
    //     senderId: 1,
    //     date: new Date(2023, 1, 1, 1, 1, 1),
    // },
    // {
    //     content: 'Ca va?',
    //     senderId: 1,
    //     date: new Date(2023, 1, 1, 1, 2, 1),
    // },
    // {
    //     content: 'Hello?',
    //     senderId: 1,
    //     date: new Date(2023, 1, 1, 1, 8, 1),
    // },
    // {
    //     content: 'Oui, ca va!',
    //     senderId: 37,
    //     date: new Date(2023, 1, 1, 1, 9, 1),
    // },
    // {
    //     content: 'Et toi?',
    //     senderId: 37,
    //     date: new Date(2023, 1, 1, 1, 9, 1),
    // },
    // {
    //     content: 'Very very long message gfdhjgb h jdfsg fdhg jdfbhjg bfdhjgb hjsdfbg jadfhgh yjdfgh hjsdfbgh jdfhjgb jadfhgh yjuasdfhghjk dfhjhg bdfhjkgh hjdfgh jhdfb gy hfdjygb fdhyjagh hjkadfbgh kudashfgjkasdhgy ujhasdi ufghdasuh gasduh fhjkasdb fhjkasdb gfjukasdfgh jkh dsuig fduisgh fuidsb fghjkdsag fhyjuasdfbgjkhbdf ajkh gdasujgh fhjukdg iudfh gkufdhg yuih dfiy ughdfuiy ghyuisdfh ',
    //     senderId: 1,
    //     date: new Date(2023, 1, 1, 1, 10, 1),
    // },
    // {
    //     content: 'Very very long message gfdhjgb h jdfsg fdhg jdfbhjg bfdhjgb hjsdfbg jadfhgh yjdfgh hjsdfbgh jdfhjgb jadfhgh yjuasdfhghjk dfhjhg bdfhjkgh hjdfgh jhdfb gy hfdjygb fdhyjagh hjkadfbgh kudashfgjkasdhgy ujhasdi ufghdasuh gasduh fhjkasdb fhjkasdb gfjukasdfgh jkh dsuig fduisgh fuidsb fghjkdsag fhyjuasdfbgjkhbdf ajkh gdasujgh fhjukdg iudfh gkufdhg yuih dfiy ughdfuiy ghyuisdfh ',
    //     senderId: 1,
    //     date: new Date(2023, 1, 1, 1, 10, 1),
    // },
    // {
    //     content: 'Very very long message gfdhjgb h jdfsg fdhg jdfbhjg bfdhjgb hjsdfbg jadfhgh yjdfgh hjsdfbgh jdfhjgb jadfhgh yjuasdfhghjk dfhjhg bdfhjkgh hjdfgh jhdfb gy hfdjygb fdhyjagh hjkadfbgh kudashfgjkasdhgy ujhasdi ufghdasuh gasduh fhjkasdb fhjkasdb gfjukasdfgh jkh dsuig fduisgh fuidsb fghjkdsag fhyjuasdfbgjkhbdf ajkh gdasujgh fhjukdg iudfh gkufdhg yuih dfiy ughdfuiy ghyuisdfh ',
    //     senderId: 37,
    //     date: new Date(2023, 1, 1, 1, 10, 1),
    // },
];

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
            of(MESSAGES),
            this.userProfileService.getUserProfile(),
            this.userProfile,
        ]).pipe(
            map(([messages, userProfile, matchedUser]) => {
                if (!userProfile || !matchedUser) return [];
                return groupMessages(messages).map((messageGroup) => {
                    const sender: UserProfile =
                        messageGroup.senderId === matchedUser.getId()
                            ? matchedUser.currentValue
                            : userProfile;
                    return {
                        date: messageGroup.date,
                        sender: {
                            name: sender.name ?? '',
                            picture: sender.pictures?.[0] ?? '',
                        },
                        isSelf: sender === userProfile,
                        messages: messageGroup.messages.map((message) => {
                            return {
                                content: message.content,
                                date: message.date,
                                sender: {
                                    name: sender.name ?? '',
                                    picture: sender.pictures?.[0] ?? '',
                                },
                            };
                        }),
                    };
                });
            }),
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
            this.sendMessage(this.form.value.message ?? '');
            this.form.reset();
        }
    }

    sendMessage(message: string) {
        if (message.length == 0 || message.length > 255) {
            throw new Error('Invalid message length');
        }

        console.log('Send', message);
    }

    updateQuestion() {
        this.question = this.getQuestion();
    }

    private getQuestion(): string {
        return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    }
}
