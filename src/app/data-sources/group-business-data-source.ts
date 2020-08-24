import { merge as observableMerge, BehaviorSubject, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Empresa, Grupo } from '../models';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GroupBusinessesDatabase } from './group-business-database';

export class GroupBusinessesDataSource extends DataSource<any> {
	_filterChange = new BehaviorSubject([]);

	filteredData: (Grupo | Empresa)[] = [];
	renderedData: (Grupo | Empresa)[] = [];

	constructor(
		private _businessesDatabase: GroupBusinessesDatabase,
		private _paginator: MatPaginator,
		private _sort: MatSort
	) {
		super();

		this._filterChange.subscribe(() => (this._paginator.pageIndex = 0));
	}

	isGroup(item): boolean {
		return item.descripcion != undefined;
	}

	getFilteredGroups() {
		var total = 0;
		this.filteredData.forEach(element => {
			if (this.isGroup(element)) {
				total++;
			}
		});
		return total;
	}

	connect(): Observable<(Grupo | Empresa)[]> {
		const displayDataChanges = [
			this._businessesDatabase.dataChange,
			this._sort.sortChange,
			this._filterChange,
			this._paginator.page
		];

		return observableMerge(...displayDataChanges).pipe(
			map(() => {
				this.filteredData = this._businessesDatabase.data.slice().filter((item: any) => {
					// if (item.infoProveedor) return true;
					if (item != undefined) {
						if (this.isGroup(item)) {
							var group = item as Grupo;
							let searchStr = group.nombre.toLowerCase();

							var is = true;
							this.filter.forEach(element => {
								if (searchStr.indexOf(element.toLowerCase()) == -1) {
									is = false;
									group.empresas.forEach(empresa => {
										empresa.paraMostrar = false;
									});
								}
							});
							if (is && group.empresas) {
								group.empresas.forEach(empresa => {
									empresa.paraMostrar = true;
								});
							}
							return is;
						} else {
							var business = item as Empresa;
							return business.paraMostrar;
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

	sortData(data: (Grupo | Empresa)[]): (Grupo | Empresa)[] {
		return data;
	}

	get filter(): string[] {
		return this._filterChange.value;
	}

	set filter(filter: string[]) {
		this._filterChange.next(filter);
	}

	get paginator(): MatPaginator {
		return this._paginator;
	}

	set paginator(paginator: MatPaginator) {
		this._paginator = paginator;
	}
}
