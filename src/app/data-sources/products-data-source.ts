import { merge as observableMerge, BehaviorSubject, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { ProductoCatalogo } from '../models';
import { DataSource } from '@angular/cdk/collections';
import { ProductsDatabase } from '../data-sources';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export class ProductsDataSource extends DataSource<any> {
	_filterChange = new BehaviorSubject([]);
	get filter(): string[] {
		return this._filterChange.value;
	}
	set filter(filter: string[]) {
		this._filterChange.next(filter);
	}

	filteredData: ProductoCatalogo[] = [];
	renderedData: ProductoCatalogo[] = [];

	constructor(public _productosDatabase: ProductsDatabase, public _paginator: MatPaginator, private _sort: MatSort) {
		super();

		this._filterChange.subscribe(() => (this._paginator.pageIndex = 0));
	}

	connect(): Observable<ProductoCatalogo[]> {
		const displayDataChanges = [
			this._productosDatabase.dataChange,
			this._sort.sortChange,
			this._filterChange,
			this._paginator.page
		];

		return observableMerge(...displayDataChanges).pipe(
			map(() => {
				this.filteredData = this._productosDatabase.data.slice().filter((item: any) => {
					let searchStr = item.descripcion + item.marca + item.cpp + item.gtinPresentacion + item.paisOrigen;

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
					if (counter != cantFilters || cantFilters == 0) {
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

				//const sortedData = this.sortData(this.filteredData.slice());

				const startIndex = this._paginator.pageIndex * this._paginator.pageSize;

				this.renderedData = this._productosDatabase.data;

				return this._productosDatabase.data;
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
