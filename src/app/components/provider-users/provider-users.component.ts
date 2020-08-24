import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'app/services';
import { Usuario } from 'app/models';

@Component({
	selector: 'provider-users',
	templateUrl: './provider-users.component.html',
	styleUrls: ['./provider-users.component.scss']
})
export class ProviderUsersComponent implements OnInit {
	users: Usuario[];

	constructor(public userService: UsuariosService) {
		userService.showCreateUser = false;
		userService.showProviderUserList = true;
		userService.showProviderUserEdit = false;
	}

	ngOnInit() {
		this.cargarUsuarios();
		this.userService.dataChange.subscribe(changed => {
			this.users = this.userService.usersDatabase.data;
		});
	}

	cargarUsuarios() {
		this.userService.getProviderUsers().subscribe(users => {
			this.userService.usersDatabase.updateUsers(users);
			this.users = this.userService.usersDatabase.data;
		});
	}

	doShowCreateUser() {
		this.userService.showCreateUser = true;
		this.userService.showProviderUserList = false;
		this.userService.showProviderUserEdit = false;
	}

	doShowListUsers() {
		this.userService.showCreateUser = false;
		this.userService.showProviderUserList = true;
		this.userService.showProviderUserEdit = false;
	}
}
