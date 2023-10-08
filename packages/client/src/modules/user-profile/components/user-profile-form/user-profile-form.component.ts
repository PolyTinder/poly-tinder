import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PROGRAMS_ARRAY } from '../../constants/programs';
import { LOOKING_FOR } from '../../constants/looking-for';
import { RELATIONSHIP_TYPES } from '../../constants/relationship-type';
import { ZODIAC_SIGNS } from '../../constants/zodiac';
import {
    DRINKING_HABITS,
    DRUGS_HABITS,
    SMOKING_HABITS,
    WORKOUT_HABITS,
} from '../../constants/lifestyle';
import {
    GENDERS,
    GENDER_IDENTITIES,
    GENDER_PREFERENCES,
    SEXUAL_ORIENTATIONS,
} from '../../constants/gender';
import { UserProfileService } from '../../services/user-profile-service/user-profile.service';
import { UserProfile } from 'common/models/user';
import { BehaviorSubject, catchError, combineLatest, debounceTime } from 'rxjs';
import { INTERESTS } from '../../constants/interets';
import { ASSOCIATIONS } from '../../constants/associations';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-user-profile-form',
    templateUrl: './user-profile-form.component.html',
    styleUrls: ['./user-profile-form.component.scss'],
})
export class UserProfileFormComponent {
    userProfileForm = new FormGroup({
        pictures: new FormControl(new Array<string | undefined>(), []),
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(255),
        ]),
        age: new FormControl(0, [
            Validators.required,
            Validators.min(0),
            Validators.max(150),
        ]),
        bio: new FormControl('', [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(255),
        ]),
        program: new FormControl('', []),
        height: new FormControl(0, [Validators.min(0), Validators.max(300)]),
        interests: new FormControl<string[]>([], []),
        associations: new FormControl<string[]>([], []),
        lookingFor: new FormControl('', []),
        relationshipType: new FormControl('', []),
        zodiacSign: new FormControl('', []),
        drinking: new FormControl('', []),
        smoking: new FormControl('', []),
        drugs: new FormControl('', []),
        workout: new FormControl('', []),
        jobTitle: new FormControl(''),
        jobCompany: new FormControl(''),
        livingIn: new FormControl(''),
        gender: new FormControl(''),
        genderCategory: new FormControl('', [Validators.required]),
        genderPreference: new FormControl('', [Validators.required]),
        sexualOrientation: new FormControl(''),
    });
    programs = PROGRAMS_ARRAY;
    lookingFor = LOOKING_FOR;
    relationshipTypes = RELATIONSHIP_TYPES;
    zodiacSigns = ZODIAC_SIGNS;
    drinkingHabits = DRINKING_HABITS;
    smokingHabits = SMOKING_HABITS;
    drugHabits = DRUGS_HABITS;
    workoutHabits = WORKOUT_HABITS;
    genders = GENDERS;
    genderIdentities = GENDER_IDENTITIES;
    genderPreferences = GENDER_PREFERENCES;
    sexualities = SEXUAL_ORIENTATIONS;
    interests = INTERESTS;
    associations = ASSOCIATIONS;

    pictures = [
        new BehaviorSubject<string | undefined>(undefined),
        new BehaviorSubject<string | undefined>(undefined),
        new BehaviorSubject<string | undefined>(undefined),
        new BehaviorSubject<string | undefined>(undefined),
        new BehaviorSubject<string | undefined>(undefined),
        new BehaviorSubject<string | undefined>(undefined),
    ];

    constructor(
        private readonly userProfileService: UserProfileService,
        private readonly snackBar: MatSnackBar,
    ) {
        this.userProfileService.getUserProfile().subscribe((userProfile) => {
            if (userProfile) {
                this.userProfileForm.patchValue(userProfile);

                if (userProfile.pictures) {
                    for (let i = 0; i < this.pictures.length; i++) {
                        this.pictures[i].next(userProfile.pictures[i]);
                    }
                }

                this.userProfileForm.markAsPristine();
            }
        });

        combineLatest(this.pictures)
            .pipe(debounceTime(1))
            .subscribe((pictures) => {
                this.userProfileForm.patchValue({ pictures });
            });
    }

    get userProfile() {
        return this.userProfileService.getUserProfile();
    }

    onSubmit() {
        if (this.userProfileForm.invalid) {
            return;
        }

        const res: Omit<Partial<UserProfile>, 'userId'> = {};

        for (const [k, v] of Object.entries(this.userProfileForm.value)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (res as any)[k] = v ?? undefined;
        }

        this.userProfileForm.markAsPending();
        this.userProfileService.updateUserProfile(res);
        this.userProfileService
            .applyUserProfileChanges()
            .pipe(
                catchError((err) => {
                    this.snackBar.open(
                        'Erreur lors de la mise à jour du profil',
                        undefined,
                        {
                            duration: 2000,
                            politeness: 'assertive',
                            verticalPosition: 'top',
                        },
                    );
                    return err;
                }),
            )
            .subscribe(() => {
                this.snackBar.open('Profil mis à jour', undefined, {
                    duration: 2000,
                    politeness: 'polite',
                    verticalPosition: 'top',
                });
            });
    }
}
