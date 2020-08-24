import { merge as observableMerge, BehaviorSubject, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { ProductoCatalogo } from '../models';
import { DataSource } from '@angular/cdk/collections';
import { ProductsDatabasePedido } from '../data-sources/products-database-pedido';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export class ProductsDataSourcePedido extends DataSource<any> {
	_filterChange = new BehaviorSubject([]);
	_filterMarcaChange = new BehaviorSubject([]);
	_filterLineaChange = new BehaviorSubject([]);
	_filterDivisionChange = new BehaviorSubject([]);
	get filter(): string[] {
		return this._filterChange.value;
	}
	set filter(filter: string[]) {
		this._filterChange.next(filter);
	}

	get filterMarca(): string[] {
		return this._filterMarcaChange.value;
	}
	set filterMarca(filter: string[]) {
		this._filterMarcaChange.next(filter);
	}

	get filterLinea(): string[] {
		return this._filterLineaChange.value;
	}
	set filterLinea(filter: string[]) {
		this._filterLineaChange.next(filter);
	}

	get filterDivision(): string[] {
		return this._filterDivisionChange.value;
	}
	set filterDivision(filter: string[]) {
		this._filterDivisionChange.next(filter);
	}

	filteredData: ProductoCatalogo[] = [];
	renderedData: ProductoCatalogo[] = [];

	constructor(
		public _productosDatabase: ProductsDatabasePedido,
		public _paginator: MatPaginator,
		private _sort: MatSort
	) {
		super();

		this._filterChange.subscribe(() => (this._paginator.pageIndex = 0));
	}

	connect(): Observable<ProductoCatalogo[]> {
		const displayDataChanges = [
			this._productosDatabase.dataChange,
			this._sort.sortChange,
			this._filterChange,
			this._filterDivisionChange,
			this._filterLineaChange,
			this._filterMarcaChange,
			this._paginator.page
		];

		return observableMerge(...displayDataChanges).pipe(
			map(() => {
				this.filteredData = this._productosDatabase.data;
				if (this.filterLinea.length > 0) {
					this.filteredData = this.filteredData.slice().filter((item: any) => {
						let flag = false;
						this.filterLinea.forEach(element => {
							if (element === item.linea) {
								flag = true;
							}
						});
						return flag;
					});
				}
				if (this.filterMarca.length > 0) {
					this.filteredData = this.filteredData.slice().filter((item: any) => {
						let flag = false;
						this.filterMarca.forEach(element => {
							if (element === item.marca) {
								flag = true;
							}
						});
						return flag;
					});
				}
				if (this.filterDivision.length > 0) {
					this.filteredData = this.filteredData.slice().filter((item: any) => {
						let flag = false;
						this.filterDivision.forEach(element => {
							if (element === item.division) {
								flag = true;
							}
						});
						return flag;
					});
				}
				this.filteredData = this.filteredData.slice().filter((item: any) => {
					let searchStr =
						item.descripcion +
						item.marca +
						item.linea +
						item.division +
						item.cpp +
						item.precio +
						item.gtinPresentacion +
						item.paisOrigen;
					if (item.categoria != undefined) {
						searchStr = searchStr + item.categoria.nombre;
						if (item.categoria.padre != undefined) {
							searchStr = searchStr + item.categoria.padre.nombre;
						}
					}

					if (item.empresasConVisibilidad != undefined) {
						item.empresasConVisibilidad.forEach(empresa => {
							searchStr = searchStr + empresa.nombre;
						});
					}

					if (item.gruposConVisibilidad != undefined) {
						item.gruposConVisibilidad.forEach(grupo => {
							searchStr = searchStr + grupo.nombre;
						});
					}

					searchStr = searchStr.toLowerCase();
					var counter = 0;
					this.filter.forEach(element => {
						if (searchStr.indexOf(element.toLowerCase()) == -1) {
							counter += 1;
						}
					});
					var cantFilters = this.filter.length;
					if (counter == 0 || cantFilters == 0) {
						return true;
					} else {
						return false;
					}
				});

				// if (true) {

				// }
				// var arr;
				// arr = this.filteredData.reduce(function (acc, prod) {
				//     if (!acc[prod.glnPublicador]) { acc[prod.glnPublicador] = []; }
				//     acc[prod.glnPublicador].push(prod);
				//     return acc;
				// }, []);

				// var sortedData = [];
				// arr.forEach(data => sortedData = sortedData.concat(this.sortData(data.slice())));

				const sortedData = this.sortData(this.filteredData.slice());

				const startIndex = this._paginator.pageIndex * this._paginator.pageSize;

				this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);

				return this.renderedData;
			})
		);
	}

	disconnect() {}

	sortData(data: ProductoCatalogo[]): ProductoCatalogo[] {
		if (!this._sort.active || this._sort.direction == '') {
			return data;
		}

		return data.sort((a, b) => {
			let propertyA: number | string = '';
			let propertyB: number | string = '';

			switch (this._sort.active) {
				case 'cpp':
					[propertyA, propertyB] = [a.cpp, b.cpp];
					break;
				case 'descripcion':
					[propertyA, propertyB] = [a.descripcion.toLowerCase(), b.descripcion.toLowerCase()];
					break;
				case 'marca':
					[propertyA, propertyB] = [a.marca, b.marca];
					break;
				case 'linea':
					[propertyA, propertyB] = [a.categoria.nombre, b.categoria.nombre];
					break;
				case 'division':
					[propertyA, propertyB] = [a.categoria.padre.nombre, b.categoria.padre.nombre];
					break;
			}

			let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
			let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

			return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
		});
	}
}
