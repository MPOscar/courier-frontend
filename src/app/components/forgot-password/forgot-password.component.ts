import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from 'app/models';
import { Router } from '@angular/router';
import { AuthenticationService, AlertService, UsuariosService } from 'app/services';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
	resetForm: FormGroup;
	user: Usuario = new Usuario();
	constructor(
		private userService: UsuariosService,
		private router: Router,
		private authenticationService: AuthenticationService,
		private fb: FormBuilder,
		private alertService: AlertService
	) {
		this.resetForm = fb.group({
			email: [undefined, [Validators.required]]
		});
	}

	ngOnInit() {}

	sendEmail() {
		var email: string = this.resetForm.value.email;
		var user = new Usuario();
		user.email = email.trim();
		delete user._links;
		delete user._filters;
		this.userService.enviarReseteoContraseñaPersonal(user).subscribe();
		this.alertService.success('Si existe su usuario se le enviará un correo');
		this.router.navigate(['/login']);
	}

	goToLogin() {
		this.router.navigate(['/login']);
	}
}
