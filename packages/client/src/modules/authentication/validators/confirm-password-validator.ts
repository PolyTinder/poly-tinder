import { AbstractControl, ValidationErrors } from '@angular/forms';

export const confirmPasswordValidator =
    (passwordControlName: string = 'password') =>
    (control: AbstractControl): ValidationErrors | null => {
        if (
            control.value &&
            control.parent &&
            control.parent.get(passwordControlName) &&
            control.value !== control.parent!.get(passwordControlName)!.value
        ) {
            return { passwordMismatch: true };
        }
        return null;
    };
