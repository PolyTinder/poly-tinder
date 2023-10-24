/* eslint-disable prettier/prettier */
import { AbstractControl, ValidationErrors } from '@angular/forms';

export const profilePictureValidator =
    (control: AbstractControl): ValidationErrors | null => {
        if (
            control.value &&
            control.value.filter((v: (string | undefined)) => typeof(v) === 'string' ? v.length : true).length > 0
        ) {
            return { picturesNotValid: true };
        }
        return null;
    };

export const arrayContainedInValidator =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <T, V = any>(
        array: T[],
        predicate: (item: T, value: V) => boolean = (item, value) => item == (value as unknown),
    ) =>
    (control: AbstractControl<V[]>): ValidationErrors | null => {
        if (
            control.value &&
            !control.value.filter((v) => typeof(v) === 'string' ? v.length : true).every((item: V) =>
                array.find((arrayItem) => predicate(arrayItem, item)),
            )
        ) {
            return { notContainedIn: true };
        }
        return null;
    };