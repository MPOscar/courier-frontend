import { ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UsersDatabase, UsersDataSource } from 'app/data-sources';
import { Usuario } from 'app/models';
import { AlertService, AuthenticationService, UsuariosService } from 'app/services';
import { Subscription } from 'rxjs';
import { CreateProviderUserComponent } from '../create-provider-user/create-provider-user.component';
import { ProviderUserEditComponent } from '../provider-user-edit/provider-user-edit.component';
import { DialogData } from 'app/models/DialogData/DialogData';
import { DialogService } from 'app/services/dialog.service';

@Component({
	selector: 'provider-user-list',
	templateUrl: './provider-user-list.component.html',
	styleUrls: ['./provider-user-list.component.scss']
})
export class ProviderUserListComponent implements OnInit {
	@Input() group;

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
		private authenticationService: AuthenticationService,
		public dialog: MatDialog,
		private router: Router,
		private dialogService: DialogService
	) {
		this.usersDatabase = new UsersDatabase();
		this.invitationsDatabase = new UsersDatabase();
		this.loadUsers();
	}
	loadUsers() {
		this.invitedUsers = new Array<Usuario>();

		this.usersSubscription = this.userService.getUsersApi().subscribe(response => {
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

	sendEmail(user) {
		try {
			this.userService.sendInvitation(user).subscribe(
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
			this.userService.cancelInvitation(user).subscribe(
				data => {
					this.alertService.success('Invitación cancelada con éxito');
					var index = this.invitedUsers.indexOf(user);
					this.invitedUsers.splice(index, 1);
					this.invitationsDatabase.updateUsers(this.invitedUsers);
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

	showCreateUser() {
		this.userService.showCreateUser = true;
		this.userService.showProviderUserList = false;
	}

	openCreateDialog(): void {
		const dialogRef = this.dialog.open(CreateProviderUserComponent, {
			width: '450px'
		});
		dialogRef.afterClosed().subscribe(result => {
			this.router.navigate(['/usuarios-proveedor']);
		});
	}

	sendPassword(user: Usuario) {
		try {
			delete user._links;
			delete user._filters;
			this.userService.enviarReseteoContraseña(user).subscribe(
				data => {
					this.managePasswordReset(data, user);
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
	managePasswordReset(data: any, user: Usuario) {
		this.alertService.success('Email enviado a ' + user.email);
	}

	openDeleteDialog(user: Usuario) {
		let dialogData = new DialogData();
		dialogData.title = 'Desvincular usuario';
		dialogData.content = '¿Seguro que desea desvincular al usuario ' + user.email + '?';
		dialogData.type = 'warn';
		dialogData.acceptButtonText = 'Desvincular';

		const dialogRef = this.dialogService.open(dialogData);
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.deleteUser(user);
			}
		});
	}

	deleteUser(user: Usuario) {
		try {
			this.userService.bajaDeEmpresa(user).subscribe(
				data => {
					this.manageDeleteUser(data, user);
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

	manageDeleteUser(data: any, user: Usuario): any {
		this.userService.usersDatabase.deleteUser(user);
		this.userService.deleteUserFromLocalDb(user);
		this.alertService.success('Usuario desvinculado con éxito', 'OK');
		this.userService.dataChange.emit(true);
		this.loadUsers();
		this.userService.showCreateUser = false;
		this.userService.showProviderUserList = true;
		this.userService.showProviderUserEdit = false;
	}

	openEditDialog(user): void {
		this.userService.userToEdit = user;
		this.userService.dataChange.emit(true);
		const dialogRef = this.dialog.open(ProviderUserEditComponent, {
			width: '450px'
		});
		dialogRef.afterClosed().subscribe(result => {
			this.router.navigate(['/usuarios-proveedor']);
		});
	}
}
