import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Empresa } from 'app/models';
import { EmpresasService, AlertService, AuthenticationService, ProductosService } from 'app/services';
import { Router } from '@angular/router';
import { S3 } from 'aws-sdk/clients/all';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidadorRut } from 'app/shared/validators/rut.validator';
import { BehaviorSubject } from 'rxjs';
//
import { ImagesService } from 'app/services/image.service';
import { AppConfig } from 'app/app.config';

@Component({
	selector: 'business-profile',
	templateUrl: './business-profile.component.html',
	styleUrls: ['./business-profile.component.scss']
})
export class BusinessProfileComponent implements OnInit {
	registerForm: FormGroup;
	business: Empresa;
	businessService: EmpresasService;
	alertService: AlertService;
	authenticationService: AuthenticationService;
	router: Router;
	hidePassword: Boolean = true;
	showCreate = false;
	file: any;
	fileActivity: boolean = false;
	public message = '';
	imgURL: BehaviorSubject<string> = new BehaviorSubject('./assets/images/no-image-available.png');
	submitted = false;
	cambiosDePerfil: boolean = false;
	isProviderAdmin: boolean = false;

	constructor(
		private fb: FormBuilder,
		private productsService: ProductosService,
		_businessService: EmpresasService,
		_alertService: AlertService,
		_authenticationService: AuthenticationService,
		_router: Router,
		public imagesService: ImagesService,
		private appConfig: AppConfig
	) {
		this.businessService = _businessService;
		this.alertService = _alertService;
		this.authenticationService = _authenticationService;
		this.router = _router;

		//	alert(localStorage.getItem('business'));
	}

	ngOnInit() {
		if (this.authenticationService.can('administradorEmpresa')) {
			this.isProviderAdmin = true;
		}
		this.business = JSON.parse(localStorage.getItem('business'));
		if (this.business.foto != undefined) {
			if (this.business.foto.indexOf('http') > -1) {
				this.imgURL.next(this.business.foto);
			} else {
				this.imgURL.next(this.appConfig.apiBucket + this.business.foto);
			}
		}
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

	hasBeenChanged() {
		if (this.business.nombre != JSON.parse(localStorage.getItem('business')).nombre) {
			this.cambiosDePerfil = true;
		} else if (this.business.razonSocial != JSON.parse(localStorage.getItem('business')).razonSocial) {
			this.cambiosDePerfil = true;
		} else if (this.business.rut != JSON.parse(localStorage.getItem('business')).rut) {
			this.cambiosDePerfil = true;
		} else {
			this.cambiosDePerfil = false;
		}
	}

	cancel() {
		this.business = JSON.parse(localStorage.getItem('business'));
		if (this.business.foto != undefined) {
			this.imgURL.next(this.business.foto);
		}
		this.cambiosDePerfil = false;
	}

	doShowCreate() {
		this.showCreate = true;
	}

	handleImageChangeEvent(image: any) {
		this.file = image;
		this.cambiosDePerfil = true;
	}

	uploadImage() {
		var self = this;
		var secretAK;
		var secretAKId;
		try {
			this.productsService.getAccessKey().subscribe(
				data => {
					secretAK = data.data.key;
					secretAKId = data.data.keyId;
					const bucket = new S3({
						accessKeyId: secretAKId,
						secretAccessKey: secretAK,
						region: 'us-east-2'
					});
					const params = {
						Bucket: 'rondanet',
						Key: 'assets/images/Empresas/' + this.business.rut,
						Body: this.file
					};

					bucket.upload(params, function(err, data) {
						if (err) {
							self.alertService.error('Ocurrió un error al subir la imagen.', 'OK');
						} else {
							self.business.foto =
								'https://s3.us-east-2.amazonaws.com/rondanet/assets/images/Empresas/' +
								self.business.rut +
								'?' +
								new Date().getTime();
							self.file = null;
							self.fileActivity = false;
						}
					});
				},
				error => {
					var httpError = error as HttpErrorResponse;
					if (httpError.status == 401) {
						this.alertService.error('Debes iniciar sesión.', 'OK');
						this.authenticationService.logout();
					} else {
						this.alertService.error('Ocurrió un error.', 'OK');
					}
				}
			);
		} catch (e) {
			this.alertService.error('Ocurrió un error.', 'OK');
		}
	}

	save() {
		if (this.file != null && this.file != undefined) {
			this.imagesService.postImagenEmpresa(this.file).subscribe(response => {
				this.business.foto = response.data;
				this.saveChanges();
			});
		} else {
			this.saveChanges();
		}
	}

	saveChanges() {
		this.submitted = true;
		if (this.registerForm.invalid) {
			return;
		}
		if (!this.invalidBusiness()) {
			try {
				//this.business.proveedor = false;
				if (this.fileActivity == true && this.file != null && this.file != undefined) {
					this.uploadImage();
				}
				this.business.activo = true;
				this.business.validado = true;
				if (this.fileActivity) {
					this.business.foto =
						'https://s3.us-east-2.amazonaws.com/rondanet/assets/images/Empresas/' + this.business.rut;
				}
				delete this.business._links;
				delete this.business._filters;
				this.businessService.update(this.business).subscribe(
					data => {
						var response = data as any;
						this.business = response.data;
						localStorage.setItem('business', JSON.stringify(this.business));
						//	alert(JSON.stringify(data));
						//	this.router.navigate(['/catalogo']);
						//	this.manageCreateBusiness(data);
						this.alertService.success('Los cambios fueron guardados.', 'OK');
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
		this.businessService.businessesDatabase.addBusiness(data.data as Empresa);
		this.businessService.dataChange.emit(true);

		this.alertService.success('Supermercado creado', 'OK');
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
}
