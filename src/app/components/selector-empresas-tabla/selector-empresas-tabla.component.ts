import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from '../../models';

@Component({
	selector: 'app-selector-empresas-tabla',
	templateUrl: './selector-empresas-tabla.component.html',
	styleUrls: ['./selector-empresas-tabla.component.scss']
})
export class SelectorEmpresasTablaComponent {
	@ViewChild('businessesPaginator', { static: true }) businessesPaginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	@Input() isAddingTable = true;
	private _businesses: Empresa[] = [];
	@Input()
	set businessesIn(empresas: Empresa[]) {
		this._businesses = this._businesses.concat(empresas);
		this.filterBusinesses();
	}
	get businessesIn(): Empresa[] {
		return this._businesses;
	}
	private _newBusinessesIn: Empresa[] = [];
	@Input()
	set newBusinessesIn(empresas: Empresa[]) {
		this._newBusinessesIn = empresas;
		this._businesses = this._newBusinessesIn;
		this.filterBusinesses();
	}
	get newBusinessesIn(): Empresa[] {
		return this._newBusinessesIn;
	}
	private _isEditing = true;
	@Input()
	public get isEditing() {
		return this._isEditing;
	}
	public set isEditing(value) {
		this._isEditing = value;
		if (!value) {
			this.displayedColumns = ['nombre', 'rut', 'razonSocial'];
		}
	}
	@Output() businessesOut: EventEmitter<Empresa[]> = new EventEmitter<Empresa[]>();

	businessesToOutput: Empresa[] = [];
	filteredBusinesses: Empresa[] = [];
	businessesDataSource: MatTableDataSource<Empresa>;
	selection = new SelectionModel<Empresa>(true, []);
	selectedFilters: string[] = [];

	displayedColumns = ['checkbox', 'nombre', 'rut', 'razonSocial'];

	constructor() {}

	ngAfterViewInit() {
		this.businessesPaginator._intl.itemsPerPageLabel = 'Por página';
		this.businessesPaginator._intl.getRangeLabel = (page, size, length) =>
			`Pág. ${page + 1} de ${Math.ceil(length / size)}`;
	}

	private setDataSources(): void {
		this.businessesDataSource = new MatTableDataSource<Empresa>(this.filteredBusinesses);
		this.businessesDataSource.sort = this.sort;
		this.businessesDataSource.paginator = this.businessesPaginator;
		this.selection.clear();
	}

	private filterBusinesses(): void {
		this.filteredBusinesses = this.businessesIn.slice().filter((item: any) => {
			let searchStr = item.nombre + item.rut + item.razonSocial;

			searchStr = searchStr.toLowerCase();
			var counter = 0;
			this.selectedFilters.forEach(element => {
				if (searchStr.indexOf(element.toLowerCase()) == -1) {
					counter += 1;
				}
			});
			var cantFilters = this.selectedFilters.length;
			if (counter != cantFilters || cantFilters == 0) {
				return true;
			} else {
				return false;
			}
		});
		this.setDataSources();
	}

	public selectBusiness(b: any): void {
		this.selection.toggle(b);
	}

	public addSelectedBusinesses(): void {
		this.selection.selected.forEach(business => {
			this.addBusiness(business);
		});
		this.filterBusinesses();
		this.setDataSources();
		this.emitBusinesses();
	}

	private addBusiness(business: Empresa): void {
		this.businessesToOutput.push(business);
		this.businessesIn.splice(this.businessesIn.indexOf(business), 1);
		this.selection.deselect(business);
	}

	public areAllBusinessesSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.businessesDataSource.data.length;
		return numSelected === numRows;
	}

	public masterToggleBusinesses(): void {
		this.areAllBusinessesSelected()
			? this.selection.clear()
			: this.businessesDataSource.data.forEach(row => this.selection.select(row));
	}

	private emitBusinesses(): void {
		this.businessesOut.emit(this.businessesToOutput);
		this.businessesToOutput = [];
	}

	public handleFilterChange(event): void {
		this.selectedFilters = event;
		this.filterBusinesses();
	}
}
