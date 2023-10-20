import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    PROGRAMS_ARRAY,
    LOOKING_FOR,
    RELATIONSHIP_TYPES,
    ZODIAC_SIGNS,
    DRINKING_HABITS,
    DRUGS_HABITS,
    SMOKING_HABITS,
    WORKOUT_HABITS,
    GENDERS,
    GENDER_IDENTITIES,
    GENDER_PREFERENCES,
    SEXUAL_ORIENTATIONS,
    INTERESTS,
    ASSOCIATIONS,
} from '../../constants';
import { UserProfileService } from '../../services/user-profile-service/user-profile.service';
import { UserProfile } from 'common/models/user';
import { BehaviorSubject, catchError, combineLatest, debounceTime } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { containedInValidator } from '../../validators/contained-in-validator';

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
        program: new FormControl('', [
            containedInValidator(
                PROGRAMS_ARRAY,
                (item, value) => item.id === value,
            ),
        ]),
        height: new FormControl(0, [Validators.min(0), Validators.max(300)]),
        interests: new FormControl<string[]>(
            [],
            [containedInValidator(INTERESTS)],
        ),
        associations: new FormControl<string[]>(
            [],
            [containedInValidator(ASSOCIATIONS)],
        ),
        lookingFor: new FormControl('', [
            containedInValidator(
                LOOKING_FOR,
                (item, value) => item.id === value,
            ),
        ]),
        relationshipType: new FormControl('', [
            containedInValidator(
                RELATIONSHIP_TYPES,
                (item, value) => item.id === value,
            ),
        ]),
        zodiacSign: new FormControl('', [
            containedInValidator(
                ZODIAC_SIGNS,
                (item, value) => item.id === value,
            ),
        ]),
        drinking: new FormControl('', [
            containedInValidator(
                DRINKING_HABITS,
                (item, value) => item.id === value,
            ),
        ]),
        smoking: new FormControl('', [
            containedInValidator(
                SMOKING_HABITS,
                (item, value) => item.id === value,
            ),
        ]),
        drugs: new FormControl('', [
            containedInValidator(
                DRUGS_HABITS,
                (item, value) => item.id === value,
            ),
        ]),
        workout: new FormControl('', [
            containedInValidator(
                WORKOUT_HABITS,
                (item, value) => item.id === value,
            ),
        ]),
        jobTitle: new FormControl(''),
        jobCompany: new FormControl(''),
        livingIn: new FormControl(''),
        gender: new FormControl(''),
        genderCategory: new FormControl('', [
            Validators.required,
            containedInValidator(GENDERS, (item, value) => item.id === value),
        ]),
        genderPreference: new FormControl('', [
            Validators.required,
            containedInValidator(
                GENDER_PREFERENCES,
                (item, value) => item.id === value,
            ),
        ]),
        sexualOrientation: new FormControl('', [
            containedInValidator(
                SEXUAL_ORIENTATIONS,
                (item, value) => item.id === value,
            ),
        ]),
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

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

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

        this.loading$.next(true);
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
                    this.loading$.next(false);
                    return err;
                }),
            )
            .subscribe(() => {
                this.snackBar.open('Profil mis à jour', undefined, {
                    duration: 2000,
                    politeness: 'polite',
                    verticalPosition: 'top',
                });
                this.loading$.next(false);
            });
    }

    markDirty() {
        this.userProfileForm.markAsDirty();
    }
}
