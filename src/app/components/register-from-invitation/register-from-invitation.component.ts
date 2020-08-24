import { Component, OnInit } from '@angular/core';
import { Usuario } from 'app/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RolesService, AlertService, UsuariosService, AuthenticationService } from 'app/services';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register-from-invitation',
	templateUrl: './register-from-invitation.component.html',
	styleUrls: ['./register-from-invitation.component.scss']
})
export class RegisterFromInvitationComponent implements OnInit {
	user: Usuario;
	options: FormGroup;
	repeatPassword = '';
	selectedRole = 0;

	constructor(
		private rolesService: RolesService,
		fb: FormBuilder,
		private alertService: AlertService,
		private usersService: UsuariosService,
		private authenticationService: AuthenticationService,
		private router: Router
	) {
		//this.user = new Usuario();
		var userString = localStorage.getItem('user');
		if (userString != null) {
			var user = JSON.parse(userString);
			this.user = user;
		} else this.user = new Usuario();
		this.options = fb.group({
			hideRequired: false,
			floatLabel: 'auto'
		});
	}

	ngOnInit() {}

	invalidName() {}
	invalidEmail() {}
	invalidLastName() {}
	invalidPassword() {}
	invalidPasswordRepeat() {}
	registerUser() {
		try {
			if (this.userIsComplete()) {
				this.user.usuario = this.user.email;
				delete this.user._links;
				delete this.user._filters;
				this.usersService.registerFromInvitation(this.user).subscribe(
					data => {
						this.manageCreateUser(data);
					},
					error => {
						var httpError = error as HttpErrorResponse;
						if (httpError.status == 401) {
							this.alertService.error('Debes iniciar sesión.', 'OK');
							this.authenticationService.logout();
						} else {
							this.alertService.error('Ocurrió un error: ' + httpError.error.errors[0], 'OK');
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
	manageCreateUser(data: any): any {
		this.alertService.success('Usuario Registrado', 'OK');
		var createdUser = data.data as Usuario;
		localStorage.setItem('user', JSON.stringify(createdUser));
		var nombre = '';
		var apellido = '';
		var user = createdUser;
		if (user.nombre != undefined) nombre = user.nombre;
		if (user.apellido != undefined) apellido = user.apellido;
		this.usersService.usersDatabase.addUser(createdUser);
		this.usersService.addUserToLocalDb(createdUser);
		this.usersService.dataChange.emit(true);

		if (createdUser.esAdministradorSistema || this.authenticationService.can('systemAdmin')) {
			this.router.navigate(['/admin-usuarios']);
		} else {
			this.router.navigate(['/catalogo']);
		}
	}

	userIsComplete() {
		if (!this.user.email) return false;
		else return true;
	}
}
