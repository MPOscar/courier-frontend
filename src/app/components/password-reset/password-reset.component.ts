import { Component, OnInit } from '@angular/core';
import { Usuario } from 'app/models';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RolesService, AlertService, UsuariosService, AuthenticationService } from 'app/services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-password-reset',
	templateUrl: './password-reset.component.html',
	styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
	user: Usuario;
	options: FormGroup;
	repeatPassword = '';
	code = '';
	constructor(
		private rolesService: RolesService,
		private route: ActivatedRoute,
		fb: FormBuilder,
		private alertService: AlertService,
		private usersService: UsuariosService,
		private authenticationService: AuthenticationService,
		private router: Router
	) {
		this.code = this.route.snapshot.params['id'];
		this.user = new Usuario();
		this.options = fb.group({
			hideRequired: false,
			floatLabel: 'auto'
		});
	}

	ngOnInit() {}

	invalidPassword() {}
	invalidPasswordRepeat() {}

	changePassword() {
		try {
			if (this.passwordsAreEqual()) {
				this.usersService.changePassword(this.code, this.user).subscribe(
					data => {
						this.authenticationService.logout();
					},
					error => {
						var httpError = error as HttpErrorResponse;
						if (httpError.status == 401) {
							this.alertService.error('Debes iniciar sesión.', 'OK');
							this.authenticationService.logout();
						} else {
							this.alertService.error('Ocurrió un error: ' + httpError.error.message, 'OK');
						}
					}
				);
			} else {
				this.alertService.error('Las contraseñas deben ser iguales');
			}
		} catch (e) {
			this.alertService.error('Ocurrió un error.', 'OK');
		}
	}
	manageChangePassword(data: any): any {
		this.router.navigate(['/catalogo']);
	}

	passwordsAreEqual() {
		if (this.user.contrasena != this.repeatPassword || this.repeatPassword.trim() == '') return false;
		else return true;
	}
}
