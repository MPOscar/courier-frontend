import { Component, OnInit } from '@angular/core';
import { Usuario } from 'app/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AlertService, UsuariosService, AuthenticationService } from 'app/services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'create-system-admin',
	templateUrl: './create-system-admin.component.html',
	styleUrls: ['./create-system-admin.component.scss']
})
export class CreateSystemAdminComponent implements OnInit {
	user: Usuario;
	options: FormGroup;
	constructor(
		fb: FormBuilder,
		private alertService: AlertService,
		private usersService: UsuariosService,
		private authenticationService: AuthenticationService
	) {
		this.user = new Usuario();
		this.options = fb.group({
			hideRequired: false,
			floatLabel: 'auto'
		});
	}

	ngOnInit() {}

	invalidEmail() {}

	createUser() {
		try {
			if (this.userIsComplete()) {
				this.user.usuario = this.user.email;
				this.usersService.inviteSystemAdmin(this.user).subscribe(
					data => {
						this.manageCreateUser(data);
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
				this.alertService.error('Debes completar todos los datos');
			}
		} catch (e) {
			this.alertService.error('Ocurrió un error.', 'OK');
		}
	}
	manageCreateUser(data: any): any {
		this.alertService.success('Usuario invitado con éxito', 'OK');
		var createdUser = data.data as Usuario;
		this.usersService.usersDatabase.addUser(createdUser);
		this.usersService.addUserToLocalDb(createdUser);
		this.usersService.dataChange.emit(true);
		//this.loadInitialData();
		this.usersService.showCreateUser = false;
		this.usersService.showProviderUserList = true;
		this.usersService.showProviderUserEdit = false;
	}

	loadInitialData() {
		this.user = new Usuario();
	}
	userIsComplete() {
		if (!this.user.email) return false;
		else return true;
	}
}
