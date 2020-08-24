import { Component, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';

export class CustomPageEvent extends PageEvent {
	rel?: 'prev' | 'next' | 'self' | 'first' | 'last';
}

@Component({
	selector: 'app-custom-paginator',
	templateUrl: './custom-paginator.component.html',
	styleUrls: ['./custom-paginator.component.scss']
})
export class CustomPaginator extends MatPaginator {
	@Output() page = new EventEmitter<CustomPageEvent>();

	constructor(_intl: MatPaginatorIntl, _changeDetectorRef: ChangeDetectorRef) {
		super(_intl, _changeDetectorRef);

		this._intl.getRangeLabel = (page, size, length) => `${size * page + 1} a ${size * page + size} de ${length}`;
	}

	firstPage = () => {
		const previousPageIndex = this.pageIndex;
		this.pageIndex = 0;

		this.page.emit({
			previousPageIndex,
			pageIndex: this.pageIndex,
			pageSize: this.pageSize,
			length: this.length,
			rel: 'first'
		});
	};

	previousPage = () => {
		const previousPageIndex = this.pageIndex;
		this.pageIndex -= 1;

		this.page.emit({
			previousPageIndex,
			pageIndex: this.pageIndex,
			pageSize: this.pageSize,
			length: this.length,
			rel: 'prev'
		});
	};

	nextPage = () => {
		const previousPageIndex = this.pageIndex;
		this.pageIndex += 1;

		this.page.emit({
			previousPageIndex,
			pageIndex: this.pageIndex,
			pageSize: this.pageSize,
			length: this.length,
			rel: 'next'
		});
	};

	lastPage = () => {
		const previousPageIndex = this.pageIndex;
		this.pageIndex = this.getNumberOfPages() - 1;

		this.page.emit({
			previousPageIndex,
			pageIndex: this.pageIndex,
			pageSize: this.pageSize,
			length: this.length,
			rel: 'last'
		});
	};

	_changePageSize = (pageSize: number) => {
		const previousPageIndex = this.pageIndex;
		this.pageIndex = 0;
		this.pageSize = pageSize;

		this.page.emit({
			previousPageIndex: previousPageIndex,
			pageIndex: this.pageIndex,
			pageSize: pageSize,
			length: this.length
		});
	};
}
