import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Empresa } from 'app/models';
import { EmpresasService, AlertService, AuthenticationService, ProductosService } from 'app/services';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { S3 } from 'aws-sdk/clients/all';
import { ValidadorRut } from 'app/shared/validators/rut.validator';
import { ImagesService } from 'app/services/image.service';

@Component({
	selector: 'create-business',
	templateUrl: './create-business.component.html',
	styleUrls: ['./create-business.component.scss']
})
export class CreateBusinessComponent implements OnInit {
	registerForm: FormGroup;
	business: Empresa;
	alertService: AlertService;
	authenticationService: AuthenticationService;
	router: Router;
	hidePassword: Boolean = true;

	nombre = '';
	apellido = '';
	file: any = null;

	public message = '';
	submitted = false;

	constructor(
		private fb: FormBuilder,
		private productsService: ProductosService,
		public businessService: EmpresasService,
		_alertService: AlertService,
		_authenticationService: AuthenticationService,
		_router: Router,
		public imagesService: ImagesService
	) {
		this.nombre = _authenticationService.getNombre();
		this.apellido = _authenticationService.getApellido();
		this.alertService = _alertService;
		this.authenticationService = _authenticationService;
		this.router = _router;
	}

	ngOnInit() {
		this.business = new Empresa();

		this.registerForm = this.fb.group(
			{
				rut: ['', Validators.required]
			},
			{
				validator: ValidadorRut()
			}
		);
	}

	get f() {
		return this.registerForm.controls;
	}

	doShowCreate() {
		this.businessService.showCreateBusiness = true;
	}

	handleImageChangeEvent(image: any) {
		this.file = image;
	}

	createBusiness() {
		this.submitted = true;
		if (this.registerForm.invalid) {
			return;
		}
		if (!this.invalidBusiness()) {
			try {
				this.business.activo = true;
				this.business.validado = true;
				this.business.gln = '-';
				this.business.foto = './assets/images/no-image-available.png';

				this.businessService.create(this.business).subscribe(
					response => {
						let data = response.data;
						this.business = data.business;
						localStorage.setItem('token', data.token);
						localStorage.setItem('role', 'providerAdmin');
						localStorage.setItem('roles', JSON.stringify(data.roles));
						localStorage.setItem('user', JSON.stringify(data.user));
						if (data.business != undefined) {
							var businesses = data.businesses;
							localStorage.setItem('businesses', JSON.stringify(businesses));
							localStorage.setItem('business', JSON.stringify(data.business));
						}
						if (this.file !== null) {
							this.imagesService.postImagenEmpresa(this.file).subscribe(response => {
								this.business.foto = response.data;
								let allBusinessesString = localStorage.getItem('businesses');
								let businesses = JSON.parse(allBusinessesString);
								businesses.forEach(empresa => {
									if (empresa.id === this.business.id) {
										empresa.foto = this.business.foto;
									}
								});
								localStorage.setItem('businesses', JSON.stringify(businesses));
								this.businessService.update(this.business).subscribe(response => {
									localStorage.setItem('business', JSON.stringify(response.data));
									this.router.navigateByUrl('/seleccionar-empresa');
								});
							});
						} else {
							this.router.navigateByUrl('/seleccionar-empresa');
						}
					},
					error => {
						var httpError = error as HttpErrorResponse;
						if (httpError.status == 401) {
							this.alertService.error('Debes iniciar sesión.', 'OK');
							this.authenticationService.logout();
						} else {
							this.alertService.error('Ocurrió un error - ' + httpError.error.message, 'OK');
						}
					}
				);
			} catch (e) {
				this.alertService.error('Ocurrió un error.', 'OK');
			}
		} else {
			this.alertService.error('Ingrese todos los datos, el rut debe ser numérico.', 'OK');
		}
	}

	manageCreateBusiness = (data: any) => {
		var business = data.data as Empresa;
		var businesses = [business];
		localStorage.setItem('businesses', JSON.stringify(businesses));
	};

	invalidBusiness() {
		return this.invalidName() || this.invalidSocialNumber() || this.invalidRut();
	}

	invalidName() {
		return this.business.nombre == undefined || this.business.nombre == '';
	}

	invalidSocialNumber() {
		return this.business.razonSocial == undefined || this.business.razonSocial == '';
	}

	invalidRut() {
		var rut: any = this.business.rut;
		return this.business.rut == undefined || isNaN(rut); //|| this.business.rut.length != 12;
	}

	getRutError() {
		if (this.business.rut == undefined) return 'Debes ingresar un rut';
		else if (this.business.rut.length != 12) return 'El rut debe ser de 12 caracteres';
	}
	cancel() {
		this.router.navigate(['/seleccionar-empresa']);
	}
}
