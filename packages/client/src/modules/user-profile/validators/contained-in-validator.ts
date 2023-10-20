/* eslint-disable prettier/prettier */
import { AbstractControl, ValidationErrors } from '@angular/forms';

export const containedInValidator =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <T, V = any>(
        array: T[],
        predicate: (item: T, value: V) => boolean = (item, value) => item == (value as unknown),
    ) =>
    (control: AbstractControl): ValidationErrors | null => {
        if (
            control.value &&
            !array.find((item) => predicate(item, control.value))
        ) {
            return { notContainedIn: true };
        }
        return null;
    };
