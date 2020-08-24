import { FormGroup } from '@angular/forms';

export function MustNotMatch(controlName: string, matchingControlName: string) {
	return (formGroup: FormGroup) => {
		const control = formGroup.controls[controlName];
		const matchingControl = formGroup.controls[matchingControlName];

		if (matchingControl.errors && !matchingControl.errors.mustNotMatch) {
			return;
		}

		if (control.value === '' || matchingControl.value === '') {
			return;
		}

		if (control.value === matchingControl.value) {
			matchingControl.setErrors({ mustNotMatch: true });
		} else {
			matchingControl.setErrors(null);
		}
	};
}
