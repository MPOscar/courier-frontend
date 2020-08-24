import { Component, OnInit } from '@angular/core';
import { SaleListService, AlertService, AuthenticationService } from 'app/services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Empresa, Producto, ListaDeVenta, Grupo } from 'app/models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'sale-list-edit',
	templateUrl: './sale-list-edit.component.html',
	styleUrls: ['./sale-list-edit.component.scss']
})
export class SaleListEditComponent implements OnInit {
	firstFormGroup: FormGroup;
	isOnFirstStep = true;
	loaderVisible = true;

	constructor(
		private formBuilder: FormBuilder,
		private alertService: AlertService,
		public saleListService: SaleListService,
		private authenticationService: AuthenticationService
	) {}

	ngOnInit() {
		this.loadInitialData();
	}

	cargarForm() {
		this.firstFormGroup = this.formBuilder.group({
			name: [this.saleListService.listToEdit.nombre],
			description: [this.saleListService.listToEdit.descripcion]
		});
	}
	firstButtonClick(stepper: MatStepper, name: string, description: string) {
		this.saleListService.name = name;
		this.saleListService.description = description;
		stepper.next();
	}
	secondButtonClick(stepper: MatStepper) {
		stepper.next();
	}

	saveSaleList() {
		var empresas = this.createEmpresaArrayOnlyIds(this.saleListService.businesses);
		var productos = this.createProductoArrayOnlyIds(this.saleListService.products);
		var grupos = this.createGrupoArrayOnlyIds(this.saleListService.groups);
		var name = this.firstFormGroup.get('name').value;
		var desc = this.firstFormGroup.get('description').value;
		if (name == '') {
			name = this.saleListService.listToEdit.nombre;
		}
		if (desc == '') {
			desc = this.saleListService.listToEdit.descripcion;
		}
		if (!this.saleListService.thirdStepDone) {
			this.alertService.error('Debes agregar por lo menos un producto');
		} else {
			var toAdd = new ListaDeVenta(name, desc, empresas, productos, grupos);
			toAdd.id = this.saleListService.listToEdit.id;
			try {
				this.saleListService.editSaleList(toAdd).subscribe(
					data => {
						this.manageEditSaleList(data);
					},
					error => {
						var httpError = error as HttpErrorResponse;
						if (httpError.status == 401) {
							this.alertService.error('Debes iniciar sesión.', 'OK');
							this.authenticationService.logout();
						} else {
							this.alertService.error(error.error.message, 'OK');
						}
					}
				);
			} catch (e) {
				this.alertService.error('Ocurrió un error.', 'OK');
			}
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
	isGroup(index, item): boolean {
		return item.descripcion != undefined;
	}
	createGrupoArrayOnlyIds(array: Grupo[]): Array<Grupo> {
		var ret = Array<Grupo>();
		array.forEach(element => {
			if (this.isGroup(1, element)) {
				var emp = new Grupo('', '', []);
				emp.id = element.id;
				ret.push(emp);
			}
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

	manageEditSaleList = (data: any) => {
		this.saleListService.saleListsDatabase.deleteSaleList(this.saleListService.listToEdit);
		this.saleListService.deleteSaleListFromLocalDb(this.saleListService.listToEdit);

		var createdSaleList = data.data as ListaDeVenta;
		createdSaleList.empresas = this.saleListService.businesses;
		createdSaleList.productos = this.saleListService.products;
		this.saleListService.saleListsDatabase.addSaleList(createdSaleList);
		this.saleListService.addSaleListToLocalDb(createdSaleList);
		this.saleListService.dataChange.emit(true);
		this.alertService.success('Lista de ventas editada.', 'OK');
		this.loadInitialData();

		this.saleListService.showCreateList = false;
		this.saleListService.showEdit = false;
		this.saleListService.showList = true;
	};

	loadInitialData() {
		this.cargarForm();
		this.saleListService.businesses = Array<Empresa>();
		this.saleListService.products = Array<Producto>();
	}

	showList() {
		this.saleListService.showCreateList = false;
		this.saleListService.showList = true;
		this.saleListService.showEdit = false;
		this.saleListService.showWatch = false;
		this.firstFormGroup.reset();
	}
}
