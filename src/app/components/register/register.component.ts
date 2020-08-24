import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, AlertService, UsuariosService } from '../../services/index';
import { Usuario } from '../../models/Usuario/Usuario';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	registerForm: FormGroup;
	loading = false;
	hidePassword = true;
	user: Usuario = new Usuario();

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private fb: FormBuilder,
		private alertService: AlertService,
		private usersService: UsuariosService
	) {
		this.registerForm = fb.group({
			nombre: [undefined, [Validators.required]],
			apellido: [undefined, [Validators.required]],
			email: [undefined, [Validators.required, Validators.email]],
			contrasena: [undefined, [Validators.required, Validators.minLength(6)]]
		});
	}

	ngOnInit() {}

	goToLogin() {
		this.router.navigate(['/login']);
	}

	register() {
		if (!this.registerForm.valid) {
			this.alertService.error('Los datos no son válidos.', 'OK');
			return false;
		}
		this.loading = true;
		this.authenticationService.register(this.registerForm.value).subscribe(
			data => {
				this.router.navigate(['enviar-email']);
			},
			error => {
				this.alertService.error(error.message, 'OK');
				this.loading = false;
			}
		);
	}
}
