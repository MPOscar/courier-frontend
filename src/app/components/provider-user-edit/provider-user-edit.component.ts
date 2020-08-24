import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from 'app/models';
import { Rol } from 'app/models/Rol/Rol';
import { AlertService, AuthenticationService, RolesService, UsuariosService } from 'app/services';

@Component({
	selector: 'provider-user-edit',
	templateUrl: './provider-user-edit.component.html',
	styleUrls: ['./provider-user-edit.component.scss']
})
export class ProviderUserEditComponent implements OnInit {
	user: Usuario;
	options: FormGroup;
	roles: Rol[];
	userRole: Rol;
	selectedRoles: Rol[];
	constructor(
		private rolesService: RolesService,
		fb: FormBuilder,
		private alertService: AlertService,
		private usersService: UsuariosService,
		public dialog: MatDialog,
		private authenticationService: AuthenticationService,
		public dialogRef: MatDialogRef<ProviderUserEditComponent>
	) {
		this.user = this.usersService.userToEdit;

		this.selectedRoles = new Array<Rol>();
		this.roles = new Array<Rol>();
		this.addFakeRoles();
		this.getRoles();

		this.options = fb.group({
			hideRequired: false,
			floatLabel: 'auto'
		});
		/*	this.usersService.dataChange.subscribe(changed => {
			this.user = this.usersService.userToEdit;
			this.user.roles.forEach(userRole => {
				this.roles.forEach(role => {
					if (role.id == userRole.id) {
						role.checked = true;
					}
				});
			});
		});*/
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

	getRoles() {
		this.rolesService.getRoles().subscribe(response => {
			if (response.code == 200) {
				response.data.forEach(rol => {
					var role: Rol = rol;
					if (role.visible == true) {
						this.roles.push(role);
					}
					if (role.rol == 'usuarioEmpresa') {
						this.userRole = rol;
					}
				});
				this.user.roles.forEach(userRole => {
					this.roles.forEach(role => {
						if (role.id == userRole.id) {
							role.checked = true;
							this.selectedRoles.push(role);
						}
					});
				});
			}
		});
	}
	ngOnInit() {}

	invalidName() {}
	invalidEmail() {}
	invalidLastName() {}
	invalidPassword() {}
	invalidPasswordRepeat() {}

	roleChecked(rol) {
		var index = this.selectedRoles.indexOf(rol);
		if (index == -1) {
			this.selectedRoles.push(rol);
		} else {
			this.selectedRoles.splice(index, 1);
		}
	}

	editUser() {
		try {
			this.user.usuario = this.user.email;
			this.user.roles = this.selectedRoles;
			this.user.roles.push(this.userRole);
			this.user.roles.forEach(rol => {
				rol.checked = undefined;
			});
			delete this.user._links;
			delete this.user._filters;
			this.usersService.cambiarRoles(this.user).subscribe(
				data => {
					this.manageEditUser(data);
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
		} catch (e) {
			this.alertService.error('Ocurrió un error inesperado, intente nuevamente.', 'OK');
		}
		this.showUserList();
	}
	manageEditUser(data: any): any {
		this.usersService.usersDatabase.deleteUser(this.usersService.userToEdit);
		this.usersService.deleteUserFromLocalDb(this.usersService.userToEdit);
		this.alertService.success('Usuario Editado con éxito', 'OK');
		var createdUser = data.data as Usuario;
		this.usersService.usersDatabase.addUser(createdUser);
		this.usersService.addUserToLocalDb(createdUser);
		this.usersService.dataChange.emit(true);
	}
	showUserList() {
		this.dialogRef.close();
	}
}
