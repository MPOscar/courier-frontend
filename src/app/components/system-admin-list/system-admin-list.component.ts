import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { UsersDataSource, UsersDatabase } from 'app/data-sources';
import { Usuario } from 'app/models';
import { ENTER } from '@angular/cdk/keycodes';
import { UsuariosService, AlertService, AuthenticationService } from 'app/services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'system-admin-list',
	templateUrl: './system-admin-list.component.html',
	styleUrls: ['./system-admin-list.component.scss']
})
export class SystemAdminListComponent implements OnInit {
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	usersSubscription: Subscription;
	dataSource: UsersDataSource | null;
	usersDatabase: UsersDatabase;
	invitationsDataSource: UsersDataSource | null;
	invitationsDatabase: UsersDatabase;
	showList = true;
	users: Usuario[];
	invitedUsers: Usuario[];

	// Propiedades de ayuda
	displayedColumns = ['nombre', 'apellido', 'email', 'quitar'];
	invitationDisplayedColumns = ['invitationEmail', 'invitationQuitar'];

	separatorKeysCodes = [ENTER];
	selectedFilters: string[] = [];
	inputFocused: boolean;
	detallesRow: number = 0;
	pendingInvitations = false;

	constructor(
		public userService: UsuariosService,
		private alertService: AlertService,
		private authenticationService: AuthenticationService
	) {
		this.usersDatabase = new UsersDatabase();
		this.invitationsDatabase = new UsersDatabase();
		this.loadUsers();
	}
	loadUsers() {
		this.invitedUsers = new Array<Usuario>();

		this.usersSubscription = this.userService.getSystemAdminUsersApi().subscribe(response => {
			var allUsers = response.data;
			allUsers.forEach(user => {
				if (user.nombre == undefined) {
					user.nombre = '   ';
				}

				if (!user.validadoParaEmpresa) {
					this.invitedUsers.push(user);
					this.pendingInvitations = true;
				}
			});
			this.users = allUsers.filter(user => user.validadoParaEmpresa == true);
			this.usersDatabase.updateUsers(this.users);
			this.invitationsDatabase.updateUsers(this.invitedUsers);
		});
	}
	cargarUsuarios() {
		this.userService.dataChange.subscribe(changed => {
			if (changed) {
				this.loadUsers();
				//this.dataSource = new UsersDataSource(this.usersDatabase, this.paginator, this.sort);
			}
		});
	}

	ngOnInit() {
		this.dataSource = new UsersDataSource(this.usersDatabase, this.paginator, this.sort);
		this.invitationsDataSource = new UsersDataSource(this.invitationsDatabase, this.paginator, this.sort);

		this.cargarUsuarios();

		this.paginator._intl.itemsPerPageLabel = 'Por página';
		this.paginator._intl.getRangeLabel = (page, size, length) => `Pág. ${page + 1} de ${Math.ceil(length / size)}`;
	}

	manageDeleteUser(data: any): any {
		var deletedUser = data.data as Usuario;
		this.userService.usersDatabase.deleteUser(deletedUser);
		this.userService.deleteUserFromLocalDb(deletedUser);
		this.alertService.success('Administrador eliminado con éxito', 'OK');
		this.userService.dataChange.emit(true);
		this.loadUsers();
	}

	deleteAdmin(user) {
		try {
			this.userService.eliminarAdministrador(user).subscribe(
				data => {
					this.manageDeleteUser(data);
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
	}

	sendEmail(user) {
		try {
			this.userService.sendInvitationAdmin(user).subscribe(
				data => {
					this.manageSendInvitation();
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
	}
	manageSendInvitation() {
		this.alertService.success('Email enviado');
	}

	cancelInvitation(user) {
		try {
			this.userService.cancelInvitationAdmin(user).subscribe(
				data => {
					this.alertService.success('Invitación cancelada con éxito');
					var index = this.invitedUsers.indexOf(user);
					this.invitedUsers.splice(index, 1);
					this.invitationsDatabase.updateUsers(this.invitedUsers);
					//	var deletedUser = data as Usuario;
					this.userService.usersDatabase.deleteUser(user);
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
	}
}
