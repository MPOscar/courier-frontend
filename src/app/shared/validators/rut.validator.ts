import { FormGroup } from '@angular/forms';

export function ValidadorRut() {
	return (formGroup: FormGroup) => {
		const control = formGroup.controls['rut'];

		if (control.errors) {
			return;
		}

		if (!/^([0-9])*$/.test(control.value)) {
			control.setErrors({ rutInvalido: true });
		}
		var dc = parseInt(control.value.toString().substr(11, 1));
		var rut = control.value.toString().substr(0, 11);
		var total = 0;
		var factor = 2;

		for (let i = 10; i >= 0; i--) {
			total += factor * rut.substr(i, 1);
			factor = factor === 9 ? 2 : ++factor;
		}

		var dv = 11 - (total % 11);

		if (dv === 11) {
			dv = 0;
		} else if (dv === 10) {
			dv = 1;
		}

		if (dv !== dc) {
			control.setErrors({ rutInvalido: true });
		}
	};
}
