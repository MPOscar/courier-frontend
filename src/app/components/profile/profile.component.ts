import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AlertService, UsuariosService, AuthenticationService } from 'app/services';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	user: Usuario;
	options: FormGroup;
	cambiosDePerfil: boolean = false;

	constructor(
		fb: FormBuilder,
		private alertService: AlertService,
		private usersService: UsuariosService,
		private authenticationService: AuthenticationService,
		private router: Router
	) {
		this.user = JSON.parse(localStorage.getItem('user'));

		this.options = fb.group({
			hideRequired: false,
			floatLabel: 'auto'
		});
	}

	invalidName() {}
	invalidEmail() {}
	invalidLastName() {}

	saveUser() {
		try {
			if (this.userIsComplete()) {
				this.user.usuario = this.user.email;
				delete this.user._links;
				this.usersService.updateUser(this.user).subscribe(
					data => {
						this.manageUpdateUser(data);
					},
					error => {
						var httpError = error as HttpErrorResponse;
						if (httpError.status == 401) {
							this.alertService.error('Debes iniciar sesión.', 'OK');
							this.authenticationService.logout();
						} else {
							var nameArray = this.user.nombre.split(' ');
							var counter = 0;

							if (httpError.error.errors == undefined) {
								this.alertService.error('Ocurrió un error: ' + httpError.error.message, 'OK');
							} else this.alertService.error('Ocurrió un error: ' + httpError.error.errors[0], 'OK');
						}
					}
				);
			} else {
				this.alertService.error('Debes completar todos los datos');
			}
		} catch (e) {
			this.alertService.error('Ocurrió un error.', 'OK');
		}
	}

	manageUpdateUser(data: any): any {
		this.cambiosDePerfil = false;
		this.alertService.success('Los cambios fueron guardados.', 'OK');
		var createdUser = data.data as Usuario;
		this.user = createdUser;

		localStorage.setItem('user', JSON.stringify(createdUser));
	}

	userIsComplete() {
		if (
			!this.user.email ||
			!this.user.nombre ||
			!this.user.apellido ||
			this.user.email.trim() == '' ||
			this.user.nombre.trim() == '' ||
			this.user.apellido.trim() == ''
		)
			return false;
		else return true;
	}

	hasBeenChanged() {
		if (this.user.nombre != JSON.parse(localStorage.getItem('user')).nombre) {
			this.cambiosDePerfil = true;
		} else if (this.user.apellido != JSON.parse(localStorage.getItem('user')).apellido) {
			this.cambiosDePerfil = true;
		} else {
			this.cambiosDePerfil = false;
		}
	}

	cancel() {
		this.user = JSON.parse(localStorage.getItem('user'));
		this.cambiosDePerfil = false;
	}

	ngOnInit() {}
}
