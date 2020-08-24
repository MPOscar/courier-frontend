import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, AlertService } from '../../services/index';

@Component({
	moduleId: module.id,
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	loading = false;
	returnUrl: string;
	hidePassword = true;

	constructor(
		private router: Router,
		private authenticationService: AuthenticationService,
		private fb: FormBuilder,
		private alertService: AlertService
	) {
		this.loginForm = this.fb.group({
			usuario: [undefined, Validators.required],
			contrasena: [undefined, Validators.required]
		});
	}

	ngOnInit() {
		localStorage.clear();
	}

	login() {
		if (!this.loginForm.valid) {
			this.alertService.error('Los datos no son válidos.', 'OK');
			return false;
		}

		this.loading = true;
		this.authenticationService.login(this.loginForm.value).subscribe(
			data => this.router.navigateByUrl('/seleccionar-empresa'),
			error => {
				this.alertService.error('Usuario o contraseña incorrectos', 'OK');
				this.loading = false;
			}
		);
	}
}
