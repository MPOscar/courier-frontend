import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AlertService, UsuariosService, AuthenticationService, RolesService } from 'app/services';
import { HttpErrorResponse } from '@angular/common/http';
import { Rol } from 'app/models/Rol/Rol';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'create-provider-user',
	templateUrl: './create-provider-user.component.html',
	styleUrls: ['./create-provider-user.component.scss']
})
export class CreateProviderUserComponent implements OnInit {
	user: Usuario;
	options: FormGroup;
	repeatPassword = '';
	selectedRole = 0;
	roles: Rol[];
	userRole: Rol;
	selectedRoles: Rol[];
	constructor(
		private rolesService: RolesService,
		fb: FormBuilder,
		private alertService: AlertService,
		private usersService: UsuariosService,
		private authenticationService: AuthenticationService,
		public dialogRef: MatDialogRef<CreateProviderUserComponent>
	) {
		this.selectedRoles = new Array<Rol>();
		this.user = new Usuario();
		this.roles = new Array<Rol>();
		this.addFakeRoles();
		this.getRoles();
		this.options = fb.group({
			hideRequired: false,
			floatLabel: 'auto'
		});
	}

	getRoles() {
		this.rolesService.getRoles().subscribe(response => {
			if (response.code == 200) {
				response.data.forEach(rol => {
					delete rol._links;
					delete rol.fechaCreacion;
					delete rol.fechaEdicion;
					var role: Rol = rol;
					if (role.visible == true) {
						this.roles.push(role);
					}
					if (role.rol == 'usuarioEmpresa') {
						this.userRole = rol;
					}
				});
			}
		});
	}
	addFakeRoles() {
		var viewProducts = new Rol();
		viewProducts.checked = true;
		viewProducts.visible = true;
		viewProducts.descripcion = 'Ver Productos';
		viewProducts.rol = 'Ver Productos';
		viewProducts.id = 0;

		var viewSaleList = new Rol();
		viewSaleList.checked = true;
		viewSaleList.visible = true;
		viewSaleList.descripcion = 'Ver Listas de Venta';
		viewSaleList.rol = 'Ver Listas de Venta';
		viewSaleList.id = 0;

		var viewGroups = new Rol();
		viewGroups.checked = true;
		viewGroups.visible = true;
		viewGroups.descripcion = 'Ver Grupos de Empresa';
		viewGroups.rol = 'Ver Grupos de Empresa';
		viewGroups.id = 0;

		this.roles.push(viewProducts);
		this.roles.push(viewGroups);
		this.roles.push(viewSaleList);
	}

	ngOnInit() {}

	roleChecked(rol) {
		var index = this.selectedRoles.indexOf(rol);
		if (index == -1) {
			this.selectedRoles.push(rol);
		} else {
			this.selectedRoles.splice(index, 1);
		}
	}

	invalidName() {}
	invalidEmail() {}
	invalidLastName() {}
	invalidPassword() {}
	invalidPasswordRepeat() {}
	createUser() {
		this.showUserList();
		try {
			if (this.userIsComplete()) {
				this.user.usuario = this.user.email;
				this.user.roles = this.selectedRoles;
				this.user.roles.push(this.userRole);
				this.usersService.inviteUser(this.user).subscribe(
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
		this.usersService.showCreateUser = false;
		this.usersService.showProviderUserList = true;
		this.usersService.showProviderUserEdit = false;
	}

	loadInitialData() {
		this.selectedRoles = new Array<Rol>();
		this.user = new Usuario();
		this.roles = new Array<Rol>();
		this.repeatPassword = '';
		this.selectedRole = 0;
	}
	userIsComplete() {
		if (!this.user.email) return false;
		else return true;
	}

	showUserList() {
		this.dialogRef.close();
	}
}
