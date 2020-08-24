import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'app/services/alert.service';

@Component({
	selector: 'app-login-dialog',
	templateUrl: './login-dialog.component.html',
	styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
	loginForm: FormGroup;
	hidePassword = true;

	constructor(
		public dialogRef: MatDialogRef<LoginDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private fb: FormBuilder,
		private alertService: AlertService
	) {
		this.loginForm = this.fb.group({
			usuario: ['', Validators.required],
			contrasena: ['', Validators.required]
		});
	}

	ngOnInit() {}

	logOut() {
		this.data.next(null);
	}

	login() {
		if (!this.loginForm.valid) {
			this.alertService.error('Los datos no son válidos.', 'OK');
		} else {
			this.data.next(this.loginForm.value);
		}
	}
}
