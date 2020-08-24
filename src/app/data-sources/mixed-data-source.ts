import { merge as observableMerge, BehaviorSubject, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Empresa } from '../models';
import { DataSource } from '@angular/cdk/collections';
import { MixedDatabase } from '../data-sources';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export class MixedDataSource extends DataSource<any> {
	_filterChange = new BehaviorSubject([]);
	get filter(): string[] {
		return this._filterChange.value;
	}
	set filter(filter: string[]) {
		this._filterChange.next(filter);
	}

	filteredData: any[] = [];
	renderedData: any[] = [];

	constructor(private _mixedDatabase: MixedDatabase, public _paginator: MatPaginator, public _sort: MatSort) {
		super();
		this._filterChange.subscribe(() => (this._paginator.pageIndex = 0));
	}

	isProduct(item) {
		if (
			item != undefined &&
			item.descripcion != undefined &&
			item.cpp != undefined &&
			item.gtinPresentacion != undefined &&
			item.marca != undefined
		)
			return true;
		return false;
	}

	connect(): Observable<Empresa[]> {
		const displayDataChanges = [
			this._mixedDatabase.dataChange,
			this._sort.sortChange,
			this._filterChange,
			this._paginator.page
		];

		return observableMerge(...displayDataChanges).pipe(
			map(() => {
				this.filteredData = this._mixedDatabase.data.slice().filter((item: any) => {
					if (this.isProduct(item)) {
						let searchStr = item.descripcion + item.marca + item.cpp + item.gtinPresentacion;

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
					}
					return true;
				});

				const sortedData = this.sortData(this.filteredData.slice());

				const startIndex = this._paginator.pageIndex * this._paginator.pageSize;

				this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);

				return this.renderedData;
			})
		);
	}

	/*updateCategories() {
		var categoriesToRemove = [];
		this.productsDataSource.filteredData.forEach(item => {
			if (item.extend != undefined) {
				var index = this.productsDataSource.filteredData.indexOf(item);
				if (this.productsDataSource.filteredData.length > index) {
					var next = this.productsDataSource.filteredData.slice(index + 1);
					if (next.length != 0) {
						var nextItem = next[0];
						if (nextItem.extend != undefined) {
							//encontre 2 categorias seguidas -> saco la primera
							categoriesToRemove.push(item);
						}
					}
				}
			}
		});
		categoriesToRemove.forEach(category => {
			var index = this.productsDataSource.filteredData.indexOf(category);
			if (index != -1) {
				this.productsDataSource.filteredData.splice(index, 1);
			}
		});
	}*/

	disconnect() {}

	sortData(data: any[]): any[] {
		if (!this._sort.active || this._sort.direction == '') {
			return data;
		}

		return data.sort((a, b) => {
			let propertyA: number | string = '';
			let propertyB: number | string = '';

			switch (this._sort.active) {
				case 'nombre':
					[propertyA, propertyB] = [a.nombre, b.nombre];
					break;
			}

			let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
			let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

			return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
		});
	}
}
