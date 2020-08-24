import { merge as observableMerge, BehaviorSubject, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Empresa } from '../models';
import { DataSource } from '@angular/cdk/collections';
import { UsersDatabase } from '../data-sources';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export class UsersDataSource extends DataSource<any> {
	_filterChange = new BehaviorSubject([]);
	get filter(): string[] {
		return this._filterChange.value;
	}
	set filter(filter: string[]) {
		this._filterChange.next(filter);
	}

	filteredData: Empresa[] = [];
	renderedData: Empresa[] = [];

	constructor(private _usersDatabase: UsersDatabase, private _paginator: MatPaginator, private _sort: MatSort) {
		super();

		this._filterChange.subscribe(() => (this._paginator.pageIndex = 0));
	}

	connect(): Observable<Empresa[]> {
		const displayDataChanges = [
			this._usersDatabase.dataChange,
			this._sort.sortChange,
			this._filterChange,
			this._paginator.page
		];

		return observableMerge(...displayDataChanges).pipe(
			map(() => {
				this.filteredData = this._usersDatabase.data.slice().filter((item: any) => {
					// if (item.infoProveedor) return true;
					if (item != undefined) {
						if (item.nombre != undefined && item.rut != undefined && item.razonSocial != undefined) {
							let searchStr = (item.nombre + item.rut + item.razonSocial).toLowerCase();

							var is = true;
							this.filter.forEach(element => {
								if (searchStr.indexOf(element.toLowerCase()) == -1) {
									is = false;
								}
							});
							return is;
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

	disconnect() {}

	sortData(data: Empresa[]): Empresa[] {
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
