import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EmpresasService, ProductosService } from '../../../services';
import { Empresa, Producto } from '../../../models';
import { Router } from '@angular/router';

@Component({
	selector: 'bussisnes-with-visibility',
	templateUrl: './bussisnes-with-visibility.component.html',
	styleUrls: ['./bussisnes-with-visibility.component.scss']
})
export class BussisnesWithVisibilityComponent implements OnInit {
	empresas: Array<Empresa> = [];
	products: Array<Producto> = [];
	@Output() onSelect = new EventEmitter<boolean>();
	selectedValue: Empresa;

	constructor(
		private _businessService: EmpresasService,
		private _router: Router,
		private productosService: ProductosService
	) {}

	ngOnInit() {
		this._businessService.getBusinessesWithVisibility().subscribe(response => {
			this.empresas = response.data;
		});
	}

	goToProvider() {
		this.productosService.businessesForMassiveVisibility = [this.selectedValue];
		this.productosService.businessesForMassiveVisibilityChosen = true;
		this._businessService
			.getVisibleProductsForThisBusinesses(this.selectedValue.id.toString())
			.subscribe(response => {
				this.products = response.data;
			});
	}

	deleteBussisnesFromList() {
		this.empresas = this.empresas.filter(item => {
			return item.id != this.selectedValue.id;
		});
	}
}
