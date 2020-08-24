import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService, AlertService, AuthenticationService } from 'app/services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-confirm-user',
	templateUrl: './confirm-user.component.html',
	styleUrls: ['./confirm-user.component.scss']
})
export class ConfirmUserComponent implements OnInit {
	confirmationCode: string;
	constructor(
		private route: ActivatedRoute,
		private usersService: UsuariosService,
		private alertService: AlertService,
		private authenticationService: AuthenticationService,
		private router: Router
	) {
		this.confirmationCode = this.route.snapshot.params['id'];
		this.confirmUser();
	}

	confirmUser() {
		this.usersService.confirmarUsuario(this.confirmationCode).subscribe(
			data => {
				this.manageConfirmUser(data);
			},
			error => {
				var httpError = error as HttpErrorResponse;
				this.alertService.error('Ocurrió un error: ' + httpError.error.errors[0], 'OK');
				this.authenticationService.logout();
			}
		);
	}

	manageConfirmUser(data: any): any {
		localStorage.setItem('token', data.data.token);
		localStorage.setItem('user', JSON.stringify(data.data.user));
		var nombre = '';
		var apellido = '';
		if (data.data.user.nombre != undefined) nombre = data.data.user.nombre;
		if (data.data.user.apellido != undefined) apellido = data.data.user.apellido;
		this.alertService.success('Usuario Confirmado', 'OK');
		this.router.navigate(['crear-empresa']);
	}

	ngOnInit() {}
}
