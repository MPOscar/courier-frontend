import { Component, OnInit } from '@angular/core';
import { AuthenticationService, AlertService } from 'app/services';
import { Usuario } from 'app/models';

@Component({
	selector: 'app-send-email',
	templateUrl: './send-email.component.html',
	styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {
	nombre = '';
	email = '';
	idUsuario = '';
	constructor(private authenticationService: AuthenticationService, private alertService: AlertService) {
		this.nombre = authenticationService.getNombre() + ' ' + this.authenticationService.getApellido();
		this.email = authenticationService.getEmail();
		this.idUsuario = authenticationService.getIdUsuario();
	}

	sendEmail() {
		var user: Usuario = new Usuario();
		user.id = +this.idUsuario;
		user.email = this.email;
		this.authenticationService.reSendEmail(user).subscribe(
			data => {
				//this.router.navigate(['send-email']);
				this.alertService.success('Email enviado, por favor verificar su casilla');
			},
			error => {
				this.alertService.error('Registro Incorrecto', 'OK');
			}
		);
	}

	ngOnInit() {}
}
