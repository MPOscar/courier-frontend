import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Empresa } from '../../../models';
import { EmpresasService, AlertService, AuthenticationService } from '../../../services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '../../../../../node_modules/@angular/common/http';

@Component({
	selector: 'app-edit-single-business',
	templateUrl: './edit-single-business.component.html',
	styleUrls: ['./edit-single-business.component.scss']
})
export class EditSingleBusinessComponent implements OnInit {
	supermarketId: number;
	supermarket: Empresa;
	options: FormGroup;

	constructor(
		fb: FormBuilder,
		private route: ActivatedRoute,
		private empresasService: EmpresasService,
		private alertService: AlertService,
		private authenticationService: AuthenticationService,
		private router: Router
	) {
		this.supermarketId = this.route.snapshot.params['id'];
		this.supermarket = empresasService.getById(this.supermarketId);
		this.options = fb.group({
			hideRequired: false,
			floatLabel: 'auto'
		});
	}

	ngOnInit() {}

	updateBusiness() {
		if (!this.invalidBusiness()) {
			try {
				var business = new Empresa();
				business.id = this.supermarket.id;
				business.nombre = this.supermarket.nombre;
				business.razonSocial = this.supermarket.razonSocial;
				business.rut = this.supermarket.rut;
				business.gln = this.supermarket.gln;
				business.activo = true;
				business.validado = true;
				this.empresasService.update(business).subscribe(
					data => {
						this.manageUpdateBusiness(data);
					},
					error => {
						var httpError = error as HttpErrorResponse;
						if (httpError.status == 401) {
							this.alertService.error('Debes iniciar sesión.', 'OK');
							this.authenticationService.logout();
							this.router.navigate(['/login']);
						} else {
							this.alertService.error('Ocurrió un error.', 'OK');
						}
					}
				);
			} catch (e) {
				this.alertService.error('Ocurrió un error.', 'OK');
			}
		}
	}

	manageUpdateBusiness = (data: any) => {
		this.supermarket = data.data as Empresa;
		this.empresasService.businessesDatabase.changeBusiness(data.data as Empresa);
		this.empresasService.dataChange.emit(true);
		this.alertService.success('Supermercado modificado', 'OK');
	};

	deleteBusiness() {
		try {
			var business = new Empresa();
			business.id = this.supermarket.id;
			business.nombre = this.supermarket.nombre;
			business.razonSocial = this.supermarket.razonSocial;
			business.rut = this.supermarket.rut;
			business.gln = this.supermarket.gln;
			business.activo = true;
			business.validado = true;
			this.empresasService.delete(business).subscribe(
				data => {
					this.manageDelete(data);
				},
				error => {
					var httpError = error as HttpErrorResponse;
					if (httpError.status == 401) {
						this.alertService.error('Debes iniciar sesión.', 'OK');
						this.authenticationService.logout();
						this.router.navigate(['/login']);
					} else {
						this.alertService.error('Ocurrió un error.', 'OK');
					}
				}
			);
		} catch (e) {
			this.alertService.error('Ocurrió un error.', 'OK');
		}
	}

	manageDelete = (data: any) => {
		this.supermarket = null;
		this.empresasService.businessesDatabase.removeBusiness(data.data as Empresa);
		this.empresasService.dataChange.emit(true);
		this.alertService.success('Supermercado eliminado', 'OK');
		this.router.navigate(['/admin-empresa']);
	};

	invalidBusiness() {
		return this.invalidName() || this.invalidSocialNumber() || this.invalidGln() || this.invalidRut();
	}

	invalidName() {
		return this.supermarket.nombre == undefined || this.supermarket.nombre == '';
	}

	invalidSocialNumber() {
		return this.supermarket.razonSocial == undefined || this.supermarket.razonSocial == '';
	}

	invalidGln() {
		return this.supermarket.gln == undefined || this.supermarket.gln == '';
	}

	invalidRut() {
		return this.supermarket.rut == undefined || ('' + this.supermarket.rut).length != 12;
	}

	getRutError() {
		if (this.supermarket.rut == undefined) return 'Debes ingresar un rut';
		else if (this.supermarket.rut.length != 12) return 'El rut debe ser de 12 caracteres';
	}
}
