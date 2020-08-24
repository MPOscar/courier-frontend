import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AlertService, SaleListService, AuthenticationService } from 'app/services';
import { Empresa, Producto, ListaDeVenta, Grupo } from 'app/models';
import { HttpErrorResponse } from '@angular/common/http';
import { HostListener } from '@angular/core';
@Component({
	selector: 'sale-lists',
	templateUrl: './sale-lists.component.html',
	styleUrls: ['./sale-lists.component.scss']
})
export class SaleListsComponent implements OnInit {
	firstFormGroup: FormGroup;
	isOnFirstStep = true;
	firstTitle = 'Información básica';
	secondTitle = 'Target';
	thirdTitle = 'Productos';
	loaderVisible = true;

	constructor(
		private formBuilder: FormBuilder,
		private alertService: AlertService,
		public saleListService: SaleListService,
		private authenticationService: AuthenticationService
	) {
		saleListService.businesses = new Array<Empresa>();
		saleListService.products = new Array<Producto>();
		saleListService.name = '';
		saleListService.description = '';
	}

	firstButtonClick(stepper: MatStepper, name: string, description: string) {
		this.saleListService.name = name;
		this.saleListService.description = description;
		stepper.next();
	}
	secondButtonClick(stepper: MatStepper) {
		stepper.next();
	}
	createSaleList() {
		if (this.saleListService.thirdStepDone) {
			var empresas = this.createEmpresaArrayOnlyIds(this.saleListService.businesses);
			var productos = this.createProductoArrayOnlyIds(this.saleListService.products);
			var grupos = this.saleListService.groups;

			var toAdd = new ListaDeVenta(
				this.firstFormGroup.controls['name'].value,
				this.firstFormGroup.controls['description'].value,
				empresas,
				productos,
				grupos
			);
			try {
				this.saleListService.createSaleList(toAdd).subscribe(
					data => {
						this.manageCreateSaleList(data);
					},
					error => {
						var httpError = error as HttpErrorResponse;
						if (httpError.status == 401) {
							this.alertService.error('Debes iniciar sesión.', 'OK');
							this.authenticationService.logout();
						} else {
							var errorMessage = '';
							if (error.error.message != undefined) errorMessage = error.error.message;
							else {
								if (error.error.errors != undefined)
									error.error.errors.forEach(element => {
										errorMessage += element + ' - ';
									});
							}
							this.alertService.error(errorMessage, 'OK');
						}
					}
				);
			} catch (e) {
				this.alertService.error('Ocurrió un error.', 'OK');
			}
		} else {
			this.alertService.error('Debes agregar por lo menos un producto');
		}
	}

	createEmpresaArrayOnlyIds(array: Empresa[]): Array<Empresa> {
		var ret = Array<Empresa>();
		array.forEach(element => {
			var emp = new Empresa();
			emp.id = element.id;
			ret.push(emp);
		});
		return ret;
	}

	createProductoArrayOnlyIds(array: Producto[]): Array<Producto> {
		var ret = Array<Producto>();
		array.forEach(element => {
			var emp = new Producto();
			emp.id = element.id;
			ret.push(emp);
		});
		return ret;
	}

	createGrupoArrayOnlyIds(array: Grupo[]): Array<Grupo> {
		var ret = Array<Grupo>();
		array.forEach(element => {
			var emp: Grupo;
			emp.id = element.id;
			ret.push(emp);
		});
		return ret;
	}

	manageCreateSaleList = (data: any) => {
		var createdSaleList = data.data as ListaDeVenta;
		createdSaleList.empresas = this.saleListService.businesses;
		createdSaleList.productos = this.saleListService.products;
		this.saleListService.saleListsDatabase.addSaleList(createdSaleList);
		this.saleListService.addSaleListToLocalDb(createdSaleList);
		this.saleListService.dataChange.emit(true);
		this.alertService.success('Lista de ventas creada.', 'OK');
		this.loadInitialData();
		this.saleListService.showCreateList = false;
		this.saleListService.showEdit = false;
		this.saleListService.showList = true;
	};

	ngOnInit() {
		this.loadInitialData();
	}

	ngOnDestroy() {}

	loadInitialData() {
		this.firstFormGroup = this.formBuilder.group({
			name: [undefined, [Validators.required]],
			description: [undefined, [Validators.required]]
		});
		this.saleListService.businesses = Array<Empresa>();
		this.saleListService.products = Array<Producto>();
	}

	showList() {
		this.saleListService.showCreateList = false;
		this.saleListService.showList = true;
		this.saleListService.showEdit = false;
		this.saleListService.showWatch = false;
	}
}
