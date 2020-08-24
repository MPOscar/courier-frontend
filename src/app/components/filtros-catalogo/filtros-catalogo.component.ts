import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Empresa, Filtro, Grupo, Producto, ProductoCatalogo } from 'app/models';
import { BehaviorSubject } from 'rxjs';
import { MatOptionSelectionChange } from '@angular/material/core';
//
import { ProductosService } from '../../services';

@Component({
	selector: 'app-filtros-catalogo',
	templateUrl: './filtros-catalogo.component.html',
	styleUrls: ['./filtros-catalogo.component.scss']
})
export class FiltrosCatalogoComponent implements OnInit, OnDestroy {
	private _productos: ProductoCatalogo[];

	filtros: Filtro[] = [];

	tiposFiltros = [];

	tiposFiltrosVisibility = [];

	productsForVisibilityFilters: Producto[];

	businesses: Empresa[];

	businessGroups: Grupo[];

	visibilidadCollapsed: boolean = false;

	prodPrivadosCollapsed: boolean = false;

	productosPrivadosCheck: boolean = false;

	productosPublicosCheck: boolean = false;

	productosFiltros: any = [];

	@Input()
	set productos(prods: ProductoCatalogo[]) {
		this._productos = prods;
		if (this.productos !== undefined) {
			this.fillBusinessesAndGroups();
			//this.loadFilters();
		}
	}

	get productos(): ProductoCatalogo[] {
		return this._productos;
	}

	private _selectedFilters: BehaviorSubject<string[]>;
	private selectedFilters: string[];

	@Input()
	set selectedFiltersInput(filters: BehaviorSubject<string[]>) {
		this._selectedFilters = filters;
		filters.subscribe(x => (this.selectedFilters = [...x]));
	}

	get selectedFiltersInput(): BehaviorSubject<string[]> {
		return this._selectedFilters;
	}

	@Input() catalogoOtros = false;
	@Input() providerId = 0;
	constructor(public productosService: ProductosService) {}

	ngOnInit() {
		this.productosService.getProductosFiltros(this.providerId).subscribe(response => {
			this.productosFiltros = response.data;
			this.loadProductsFilters();
		});

		if (this.productos !== undefined) {
			this.fillBusinessesAndGroups();
			//this.loadFilters();
		}
	}

	loadProductsFilters() {
		this.tiposFiltros = [
			{ nombre: 'Línea/familia', filtros: [] },
			{ nombre: 'Marca', filtros: [] },
			{ nombre: 'División', filtros: [] }
		];

		for (var i = 0; i < this.productosFiltros.lineas.length; i++) {
			this.tiposFiltros[0].filtros[i] = [];
			this.tiposFiltros[0].filtros[i].nombre =
				this.productosFiltros.lineas[i] !== '' ? this.productosFiltros.lineas[i] : 'Sin Linea';
			this.tiposFiltros[0].filtros[i].checked = false;
		}

		for (var i = 0; i < this.productosFiltros.marcas.length; i++) {
			this.tiposFiltros[1].filtros[i] = [];
			this.tiposFiltros[1].filtros[i].nombre =
				this.productosFiltros.marcas[i] !== '' ? this.productosFiltros.marcas[i] : 'Sin Marca';
			this.tiposFiltros[1].filtros[i].checked = false;
		}

		for (var i = 0; i < this.productosFiltros.divisiones.length; i++) {
			this.tiposFiltros[2].filtros[i] = [];
			this.tiposFiltros[2].filtros[i].nombre =
				this.productosFiltros.divisiones[i] !== '' ? this.productosFiltros.divisiones[i] : 'Sin Division';
			this.tiposFiltros[2].filtros[i].checked = false;
		}
	}

	loadFilters() {
		var brandsArray = [];
		var divisionsArray = [];
		var linesArray = [];
		this.productos.forEach(product => {
			brandsArray.push(product.marca);
			if (product.categoria != undefined) {
				divisionsArray.push(product.categoria.nombre);
				if (product.categoria.padre != undefined) {
					linesArray.push(product.categoria.padre.nombre);
				}
			}
		});
		let uniqueBrandsArray = Array.from(new Set(brandsArray));
		let uniqueDivisionsArray = Array.from(new Set(divisionsArray));
		let uniqueLinesArray = Array.from(new Set(linesArray));
		this.tiposFiltros = [
			{ nombre: 'Línea/familia', filtros: [] },
			{ nombre: 'Marca', filtros: [] },
			{ nombre: 'División', filtros: [] }
		];
		uniqueLinesArray = uniqueLinesArray.sort();
		for (var i = 0; i < uniqueLinesArray.length; i++) {
			this.tiposFiltros[0].filtros[i] = [];
			this.tiposFiltros[0].filtros[i].nombre = uniqueLinesArray[i];
			this.tiposFiltros[0].filtros[i].checked = false;
		}
		uniqueBrandsArray = uniqueBrandsArray.sort();
		for (var i = 0; i < uniqueBrandsArray.length; i++) {
			this.tiposFiltros[1].filtros[i] = [];
			this.tiposFiltros[1].filtros[i].nombre = uniqueBrandsArray[i];
			this.tiposFiltros[1].filtros[i].checked = false;
		}
		uniqueDivisionsArray = uniqueDivisionsArray.sort();
		for (var i = 0; i < uniqueDivisionsArray.length; i++) {
			this.tiposFiltros[2].filtros[i] = [];
			this.tiposFiltros[2].filtros[i].nombre = uniqueDivisionsArray[i];
			this.tiposFiltros[2].filtros[i].checked = false;
		}
	}

	fillBusinessesAndGroups() {
		this.businesses = new Array<Empresa>();
		this.businessGroups = new Array<Grupo>();
		this.productsForVisibilityFilters = this.productos;
		this.productsForVisibilityFilters.forEach(product => {
			if (product.empresasConVisibilidad != undefined) {
				product.empresasConVisibilidad.forEach(business => {
					if (!this.arrayContainsElement(this.businesses, business)) {
						this.businesses.push(business);
					}
				});
			}

			if (product.gruposConVisibilidad != undefined) {
				product.gruposConVisibilidad.forEach(group => {
					if (!this.arrayContainsElement(this.businessGroups, group)) {
						this.businessGroups.push(group);
					}
				});
			}
		});
	}

	arrayContainsElement(array: any, element: any): boolean {
		for (var i = 0; i < array.length; i++) {
			if (array[i].id === element.id) {
				return true;
			}
		}
		return false;
	}

	checkFiltro(event: MatOptionSelectionChange, option: string) {
		if (
			event.source.value === 'Sin Linea' ||
			event.source.value === 'Sin Division' ||
			event.source.value === 'Sin Marca'
		) {
			event.source.value = '';
		}
		switch (option) {
			case this.tiposFiltros[0].nombre:
				this.updateLineaFiltros(event.source.value);
				break;
			case this.tiposFiltros[1].nombre:
				this.updateMarcaFiltros(event.source.value);
				break;
			case this.tiposFiltros[2].nombre:
				this.updateDivisionFiltros(event.source.value);
				break;
			default:
				break;
		}
		this.selectedFiltersInput.next([...this.selectedFilters, event.source.value]);
	}

	updateLineaFiltros(linea: string) {
		const index = this.productosService.selectedLineas.findIndex(item => {
			return item === linea;
		});
		index > -1
			? (this.productosService.selectedLineas = this.productosService.selectedLineas.filter(item => {
					return item !== linea;
			  }))
			: this.productosService.selectedLineas.push(linea);
	}

	updateDivisionFiltros(division: string) {
		const index = this.productosService.selectedDivisiones.findIndex(item => {
			return item === division;
		});
		index > -1
			? (this.productosService.selectedDivisiones = this.productosService.selectedDivisiones.filter(item => {
					return item !== division;
			  }))
			: this.productosService.selectedDivisiones.push(division);
	}

	updateMarcaFiltros(marca: string) {
		const index = this.productosService.selectedMarcas.findIndex(item => {
			return item === marca;
		});
		index > -1
			? (this.productosService.selectedMarcas = this.productosService.selectedMarcas.filter(item => {
					return item !== marca;
			  }))
			: this.productosService.selectedMarcas.push(marca);
	}

	// checkProdPublicos() {
	// 	if (this.productosPublicosCheck) {
	// 		//logica agregar filtro
	// 	} else {
	// 		//logica borrar filtro
	// 	}
	// }

	// checkProdPrivados() {
	// 	if (this.productosPrivadosCheck) {
	// 		//logica agregar filtro
	// 	} else {
	// 		//logica borrar filtro
	// 	}
	// }

	ngOnDestroy() {
		this.productosService.resetFilters();
	}
}
