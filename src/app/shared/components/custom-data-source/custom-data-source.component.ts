import { DataSource } from '@angular/cdk/table';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject } from 'rxjs';

import { CustomPaginator } from '../custom-paginator/custom-paginator.component';

import { ProductoCatalogo } from 'app/models';
import { ProductsDatabase } from 'app/data-sources';
import { Utils } from 'app/utils/Utils';

export class CustomDataSource extends DataSource<any> {
	public requestUrlSubject: BehaviorSubject<string>;
	public requestUrl: string;

	public data: any[];
	public links: any[];
	public total: number;

	constructor(
		public _productosDatabase: ProductsDatabase,
		public _paginator: CustomPaginator,
		private _sort: MatSort
	) {
		super();

		this.requestUrlSubject = new BehaviorSubject<string>(this.requestUrl);

		this._paginator.page.subscribe(event => {
			if (event.rel) {
				const link = this.links.find(link => link.rel == event.rel);
				this.requestUrlSubject.next(link.uri);
				return;
			}

			this.requestUrl = Utils.deserializarUrl(this.requestUrl).root;
			this.requestUrlSubject.next(`${this.requestUrl}?limit=${event.pageSize}&page=${event.pageIndex}`);
		});

		this._sort.sortChange.subscribe(event => {
			// TODO
		});
	}

	connect(): Observable<ProductoCatalogo[]> {
		return this._productosDatabase.dataChange;
	}

	disconnect() {}
}
