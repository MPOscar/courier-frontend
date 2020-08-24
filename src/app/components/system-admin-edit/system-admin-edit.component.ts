import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Empresa } from 'app/models';
import { EmpresasService, AlertService, AuthenticationService, ProductosService } from 'app/services';
import { Router } from '@angular/router';
import { S3 } from 'aws-sdk/clients/all';
import { HttpErrorResponse } from '@angular/common/http';
import { Baja } from 'app/models/Baja/Baja';

@Component({
	selector: 'system-admin-edit',
	templateUrl: './system-admin-edit.component.html',
	styleUrls: ['./system-admin-edit.component.scss']
})
export class SystemAdminEditComponent implements OnInit {
	options: FormGroup;
	business: Empresa;
	businessService: EmpresasService;
	alertService: AlertService;
	authenticationService: AuthenticationService;
	router: Router;
	hidePassword: Boolean = true;
	showCreate = false;
	file: any;
	fileActivity: boolean = false;
	public imagePath;
	public message = '';
	imgURL: string = './assets/images/no-image-available.png';
	inactivations: Baja[];
	newInactivation: Baja;

	constructor(
		fb: FormBuilder,
		private productsService: ProductosService,
		_businessService: EmpresasService,
		_alertService: AlertService,
		_authenticationService: AuthenticationService,
		_router: Router
	) {
		this.businessService = _businessService;
		this.alertService = _alertService;
		this.authenticationService = _authenticationService;
		this.router = _router;
		this.options = fb.group({
			hideRequired: false,
			floatLabel: 'auto'
		});

		//	alert(localStorage.getItem('business'));
	}

	ngOnInit() {
		var inactivation1 = new Baja();
		inactivation1.motivo = 'SE me canto';
		inactivation1.fechaCreacion = 'fecha 1';
		inactivation1.fechaEdicion = 'fecha 2';

		var inactivation2 = new Baja();
		inactivation2.motivo = 'SE me canto 2';
		inactivation2.fechaCreacion = 'fecha 3';
		inactivation2.fechaEdicion = 'fecha 4';

		//	this.inactivations.push(inactivation1);
		//	this.inactivations.push(inactivation2);

		this.newInactivation = new Baja();

		this.business = JSON.parse(localStorage.getItem('business'));

		if (this.business.bajas == undefined) this.inactivations = new Array<Baja>();
		else this.inactivations = this.business.bajas;

		if (this.business.foto != undefined) {
			this.imgURL = this.business.foto;
		}
	}

	doShowCreate() {
		this.showCreate = true;
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

	makeInactive() {
		this.business.nuevaBaja = this.newInactivation;
		try {
			this.businessService.inactivate(this.business).subscribe(
				data => {
					this.alertService.success('Empresa dada de baja con éxito');
					var response = data as any;

					var business = response.data;
					this.business = business;
					this.businessService.dataChange.emit(true);
					this.businessService.showModifyBusiness = false;
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
	}

	makeActive() {
		try {
			this.businessService.activate(this.business).subscribe(
				data => {
					this.alertService.success('Empresa dada de alta con éxito');
					var response = data as any;

					var business = response.data;
					this.business = business;
					this.businessService.dataChange.emit(true);
					this.businessService.showModifyBusiness = false;
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
	}
	saveChanges() {
		if (!this.invalidBusiness()) {
			try {
				//this.business.proveedor = false;
				//this.business.nuevaBaja = undefined;
				if (this.fileActivity == true && this.file != null && this.file != undefined) {
					this.uploadImage();
				}
				this.business.activo = true;
				this.business.validado = true;
				if (this.fileActivity) {
					this.business.foto =
						'https://s3.us-east-2.amazonaws.com/rondanet/assets/images/Empresas/' +
						this.business.rut +
						'.jpg';
				}
				this.businessService.updateFromAdmin(this.business).subscribe(
					data => {
						this.alertService.success('Empresa modificada con éxito');
						var response = data as any;

						var business = response.data;
						this.businessService.dataChange.emit(true);
						this.businessService.showModifyBusiness = false;
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

	goBack() {
		this.businessService.showModifyBusiness = false;
	}

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
