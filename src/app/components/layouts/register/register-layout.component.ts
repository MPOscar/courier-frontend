import { UsuariosService } from '../../../services/index';

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/index';
@Component({
	moduleId: module.id,
	templateUrl: 'register-layout.component.html',
	styleUrls: ['./register-layout.component.scss']
})
export class RegisterLayoutComponent {
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private authenticationService: AuthenticationService,
		public usersService: UsuariosService
	) {}
	logout(): void {
		this.authenticationService.logout();
	}
}
