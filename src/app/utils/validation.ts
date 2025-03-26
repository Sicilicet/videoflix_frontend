import { AbstractControl, ValidatorFn } from '@angular/forms';

export default class Validation {
  /**
   * This function compares two variables, in this case passwords.
   * @param controlName string
   * @param checkControlName string
   * @returns Object ValidatorFn or null
   */
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}
