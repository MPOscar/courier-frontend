import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'app/services';

@Component({
	selector: 'app-system-admin-users',
	templateUrl: './system-admin-users.component.html',
	styleUrls: ['./system-admin-users.component.scss']
})
export class SystemAdminUsersComponent implements OnInit {
	constructor(public userService: UsuariosService) {
		// this.showCreateUser = true;
		userService.showCreateUser = true;
		userService.showProviderUserList = false;
		userService.showProviderUserEdit = false;
	}

	ngOnInit() {}

	cargarUsuarios() {}

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
