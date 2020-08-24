import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Empresa } from 'app/models';
import { AlertService, AuthenticationService, ProductosService, EmpresasService } from 'app/services';
import { Router } from '@angular/router';
import { S3 } from 'aws-sdk/clients/all';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'system-admin-create-business',
	templateUrl: './system-admin-create-business.component.html',
	styleUrls: ['./system-admin-create-business.component.scss']
})
export class SystemAdminCreateBusinessComponent implements OnInit {
	options: FormGroup;
	business: Empresa;
	alertService: AlertService;
	authenticationService: AuthenticationService;
	router: Router;
	hidePassword: Boolean = true;

	nombre = '';

	apellido = '';
	file: any;
	fileActivity: boolean = false;
	public imagePath;
	public message = '';
	imgURL: string = './assets/images/no-image-available.png';

	constructor(
		fb: FormBuilder,
		private productsService: ProductosService,
		public businessService: EmpresasService,
		_alertService: AlertService,
		_authenticationService: AuthenticationService,
		_router: Router
	) {
		this.nombre = _authenticationService.getNombre();
		this.apellido = _authenticationService.getApellido();
		this.alertService = _alertService;
		this.authenticationService = _authenticationService;
		this.router = _router;
		this.options = fb.group({
			hideRequired: false,
			floatLabel: 'auto'
		});
	}

	ngOnInit() {
		this.business = new Empresa();
	}

	doShowCreate() {
		this.businessService.showCreateBusiness = true;
	}

	preview(files, fileInput: any) {
		if (files.length === 0) return;

		var mimeType = files[0].type;
		if (mimeType.match(/image\/*/) == null) {
			this.message = 'Solo se aceptan imágenes.';
			return;
		}

		var reader = new FileReader();
		this.imagePath = files;
		reader.readAsDataURL(files[0]);
		reader.onload = _event => {
			this.imgURL = reader.result.toString();
		};
		this.fileEvent(fileInput);
	}
	fileEvent(fileInput: any) {
		this.file = fileInput.target.files[0];
		this.fileActivity = true;
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
						Key: 'assets/images/Empresas/' + this.business.rut + '.jpg',
						Body: this.file
					};

					bucket.upload(params, function(err, data) {
						if (err) {
							self.alertService.error('Ocurrió un error al subir la imagen.', 'OK');
						} else {
							self.business.foto =
								'https://s3.us-east-2.amazonaws.com/rondanet/assets/images/Empresas/' +
								self.business.rut +
								'.jpg?' +
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

	createBusiness() {
		if (!this.invalidBusiness()) {
			if (!this.invalidEmail()) {
				try {
					//this.business.proveedor = false;
					if (this.fileActivity == true && this.file != null && this.file != undefined) {
						this.uploadImage();
					}
					this.business.activo = true;
					this.business.validado = true;
					this.business.gln = '-';
					if (this.fileActivity) {
						this.business.foto =
							'https://s3.us-east-2.amazonaws.com/rondanet/assets/images/Empresas/' +
							this.business.rut +
							'.jpg';
					}
					this.businessService.createFromAdmin(this.business).subscribe(
						data => {
							//this.router.navigate(['/catalogo']);
							this.manageCreateBusiness(data);
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
				this.alertService.error('Ingrese el email del administrador de la nueva empresa');
			}
		} else {
			this.alertService.error('Ingrese todos los datos, el rut debe ser numérico.', 'OK');
		}
	}

	manageCreateBusiness = (data: any) => {
		var business = data.data as Empresa;
		this.alertService.success('Empresa creada, hace falta activarla');
		//var businesses = [business];
		//localStorage.setItem('businesses', JSON.stringify(businesses));
		/*this.businessService.businessesDatabase.addBusiness(data.data as Empresa);
		this.businessService.dataChange.emit(true);

		this.alertService.success('Supermercado creado', 'OK');*/
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

	invalidEmail() {
		return this.business.email == undefined || this.business.email == '';
	}

	invalidGln() {
		return this.business.gln == undefined || this.business.gln == '';
	}

	getRutError() {
		if (this.business.rut == undefined) return 'Debes ingresar un rut';
		else if (this.business.rut.length != 12) return 'El rut debe ser de 12 caracteres';
	}
	getEmailError() {}
}
