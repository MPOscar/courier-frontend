import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService, AlertService, AuthenticationService } from 'app/services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-accept-invitation',
	templateUrl: './accept-invitation.component.html',
	styleUrls: ['./accept-invitation.component.scss']
})
export class AcceptInvitationComponent implements OnInit {
	acceptCode: string;
	hasError = false;
	errorMessage = '';

	constructor(
		private route: ActivatedRoute,
		private usersService: UsuariosService,
		private alertService: AlertService,
		private authenticationService: AuthenticationService,
		private router: Router
	) {
		this.acceptCode = this.route.snapshot.params['id'];
		this.acceptInvitation();
	}

	ngOnInit() {}

	goBack() {
		this.authenticationService.logout();
	}
	acceptInvitation() {
		this.usersService.aceptarInvitacion(this.acceptCode).subscribe(
			data => {
				this.manageAcceptInvitation(data);
			},
			error => {
				var httpError = error as HttpErrorResponse;
				this.errorMessage = httpError.error.message;
				//	this.alertService.error('Ocurrió un error: ' + httpError.error.errors[0], 'OK');
			}
		);
	}

	manageAcceptInvitation(data: any): any {
		localStorage.setItem('token', data.data.token);
		localStorage.setItem('role', 'providerAdmin');
		localStorage.setItem('roles', JSON.stringify(data.data.roles));
		localStorage.setItem('user', JSON.stringify(data.data.user));
		if (data.data.business != undefined) {
			localStorage.setItem('business', JSON.stringify(data.data.business));
		}

		var nombre = '';
		var apellido = '';

		localStorage.removeItem('businesses');
		localStorage.setItem('businesses', JSON.stringify(data.data.businesses));
		this.alertService.success('Invitación Aceptada', 'OK');

		if (data.data.user.nombre == undefined) {
			this.router.navigate(['/registro-invitacion']);
		} else {
			var user = data.data.user;
			if (user.nombre != undefined) nombre = user.nombre;
			if (user.apellido != undefined) apellido = user.apellido;

			this.router.navigate(['/seleccionar-empresa']);
		}
	}
}
