import { merge as observableMerge, BehaviorSubject, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Categoria } from '../models';
import { DataSource } from '@angular/cdk/collections';
import { CategoriesDatabase } from '../data-sources';

export class CategoriesDataSource extends DataSource<any> {
	_filterChange = new BehaviorSubject([]);
	get filter(): string[] {
		return this._filterChange.value;
	}
	set filter(filter: string[]) {
		this._filterChange.next(filter);
	}

	filteredData: Categoria[] = [];
	renderedData: Categoria[] = [];

	constructor(private _categoriesDatabase: CategoriesDatabase) {
		super();
	}

	connect(): Observable<Categoria[]> {
		const displayDataChanges = [this._categoriesDatabase.dataChange, this._filterChange];

		return observableMerge(...displayDataChanges).pipe(
			map(() => {
				this.filteredData = this._categoriesDatabase.data.slice().filter((item: any) => {
					// if (item.infoProveedor) return true;
					let searchStr = item.nombre.toLowerCase();

					var is = true;
					this.filter.forEach(element => {
						if (searchStr.indexOf(element.toLowerCase()) == -1) {
							is = false;
						}
					});
					return is;
				});
				const sortedData = this.sortData(this.filteredData.slice());
				return this.renderedData;
			})
		);
	}

	disconnect() {}

	sortData(data: Categoria[]): Categoria[] {
		return data;
	}
}
