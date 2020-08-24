import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfig } from 'app/app.config';
import { Producto } from 'app/models';

@Component({
	selector: 'app-selector-productos-tabla',
	templateUrl: './selector-productos-tabla.component.html',
	styleUrls: ['./selector-productos-tabla.component.scss']
})
export class SelectorProductosTablaComponent implements OnInit {
	@ViewChild('productsPaginator', { static: true }) productsPaginator: MatPaginator;

	@Input() isAddingTable = true;
	private _productos: Producto[] = [];
	@Input()
	set productsIn(prods: Producto[]) {
		this._productos = this._productos.concat(prods);
		this._productos.sort(this.compareProductsByDivision);
		this.filterProducts();
	}
	get productsIn(): Producto[] {
		return this._productos;
	}
	private _newProductosIn: Producto[] = [];
	@Input()
	set newProductosIn(prods: Producto[]) {
		this._newProductosIn = prods;
		this._newProductosIn.sort(this.compareProductsByDivision);
		this._productos = this._newProductosIn;
		this.filterProducts();
	}
	get newProductosIn(): Producto[] {
		return this._newProductosIn;
	}
	private _isEditing = true;
	@Input()
	public get isEditing() {
		return this._isEditing;
	}
	public set isEditing(value) {
		this._isEditing = value;
		if (!value) {
			this.displayedGroupColumns = ['groupName'];
			this.displayedColumns = ['imagen', 'cpp', 'descripcion', 'gtin', 'marca', 'linea'];
		}
	}
	@Output() productosOut: EventEmitter<Producto[]> = new EventEmitter<Producto[]>();

	productsToOutput: Producto[] = [];
	groupedProducts: Producto[] = [];
	productsDataSource: MatTableDataSource<Producto>;
	selection = new SelectionModel<Producto>(true, []);
	selectedFilters: string[] = [];

	isGroupRow = (index, item) => item.groupName !== undefined;
	displayedColumns = ['checkbox', 'imagen', 'cpp', 'descripcion', 'gtin', 'marca', 'linea'];
	displayedGroupColumns = ['checkbox', 'groupName'];

	constructor(public appConfig: AppConfig) {}

	ngOnInit() {}

	ngAfterViewInit() {
		this.productsPaginator._intl.itemsPerPageLabel = 'Por página';
		this.productsPaginator._intl.getRangeLabel = (page, size, length) =>
			`Pág. ${page + 1} de ${Math.ceil(length / size)}`;
	}

	private compareProductsByDivision(p1, p2): number {
		if (p1.categoria.nombre < p2.categoria.nombre) return -1;
		if (p1.categoria.nombre > p2.categoria.nombre) return 1;
		return 0;
	}

	private setDataSources(): void {
		this.productsDataSource = new MatTableDataSource<Producto>(this.groupedProducts);
		this.productsDataSource.paginator = this.productsPaginator;
		this.selection.clear();
	}

	private setProductGroups(products: Producto[]): void {
		if (products.length > 0) {
			this.groupedProducts = [];
			var firstProduct = products[0];
			var firstProductTitle: any = this.createProductTitle(firstProduct);
			this.groupedProducts.push(firstProductTitle);

			var currentTitleText = firstProduct.categoria.nombre;
			products.forEach(product => {
				if (product.categoria && product.categoria.nombre !== currentTitleText) {
					var currentTitle: any = this.createProductTitle(product);
					this.groupedProducts.push(currentTitle);
					currentTitleText = product.categoria.nombre;
				}
				this.groupedProducts.push(product);
			});
		} else {
			this.groupedProducts = [];
		}
		this.setDataSources();
	}

	private createProductTitle(product: Producto): any {
		let title: any = new Object();
		const nombreCategoria = product.categoria.nombre;
		title.groupName = nombreCategoria;
		return title;
	}

	private sortByGroups(products: Producto[]) {
		if (products.length > 1) {
			let sortFunction = (a: any, b: any): number => {
				if (this.isGroupTitle(a) && this.isGroupTitle(b)) {
					return this.compare(a.groupName, b.groupName, true);
				}
				if (this.isGroupTitle(a) && !this.isGroupTitle(b)) {
					return this.compare(a.groupName, b.categoria.nombre, true);
				}
				if (!this.isGroupTitle(a) && this.isGroupTitle(b)) {
					return this.compare(a.categoria.nombre, b.groupName, true);
				}
				if (!this.isGroupTitle(a) && !this.isGroupTitle(b)) {
					return this.compare(a.categoria.nombre, b.categoria.nombre, true);
				}
			};
			products.sort(sortFunction);
		}
	}

	private compare(a: number | string, b: number | string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	}

	private filterProducts(): void {
		let filteredProducts = this.productsIn.slice().filter((item: any) => {
			let searchStr = item.descripcion + item.marca + item.cpp + item.gtinPresentacion + item.paisOrigen;

			if (item.categoria != undefined) {
				searchStr = searchStr + item.categoria.nombre;
				if (item.categoria.padre != undefined) {
					searchStr = searchStr + item.categoria.padre.nombre;
				}
			}

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
		this.setProductGroups(filteredProducts);
	}

	private productoArrayContainsGroup(products: Producto[], group: any): boolean {
		let containsGroup = false;
		for (let i = 0; i < products.length && !containsGroup; i++) {
			const product: any = products[i];
			if (this.isGroupTitle(product) && product.groupName === group.groupName) {
				containsGroup = true;
			}
		}
		return containsGroup;
	}

	private addGroup(product: Producto): void {
		if (!this.isGroupTitle(product)) {
			var group: any = this.createProductTitle(product);
			if (!this.productoArrayContainsGroup(this.productsToOutput, group)) {
				this.productsToOutput.push(group);
			}
		}
	}

	private addProduct(product: Producto): void {
		if (!this.isGroupTitle(product)) {
			this.productsToOutput.push(product);
			this.productsIn.splice(this.productsIn.indexOf(product), 1);
		}
		this.groupedProducts.splice(this.groupedProducts.indexOf(product), 1);
		this.selection.deselect(product);
	}

	public addSelectedProducts(): void {
		this.selection.selected.forEach(product => {
			this.addGroup(product);
			this.addProduct(product);
		});
		this.sortByGroups(this.productsToOutput);
		this.setDataSources();
		this.emitProducts();
	}

	public selectProduct(obj: any) {
		if (this.isGroupTitle(obj)) {
			let title = obj.groupName;
			if (!this.selection.isSelected(obj) && this.groupIsIndeterminate(obj)) {
				this.selectProductGroup(title);
			} else {
				this.toggleProductGroup(title);
			}
		} else {
			let product = obj as Producto;
			this.selection.toggle(product);
			let productGroup = this.findGroupObject(product.categoria.nombre);
			if (this.selection.isSelected(productGroup)) {
				if (!this.wholeProductGroupIsSelected(product.categoria.nombre)) {
					this.selection.toggle(productGroup);
				}
			} else {
				if (this.wholeProductGroupIsSelected(product.categoria.nombre)) {
					this.selection.toggle(productGroup);
				}
			}
		}
	}

	private isGroupTitle(obj: any): boolean {
		return obj.groupName !== undefined;
	}

	private selectProductGroup(linea: string) {
		this.productsDataSource.data.forEach(obj => {
			if (this.isGroupTitle(obj)) {
				let title = (obj as any).groupName;
				if (title === linea) {
					this.selection.select(obj);
				}
			} else {
				let product = obj as Producto;
				if (product.categoria && product.categoria.nombre === linea) {
					this.selection.select(product);
				}
			}
		});
	}

	private toggleProductGroup(linea: string) {
		this.productsDataSource.data.forEach(obj => {
			if (this.isGroupTitle(obj)) {
				let title = (obj as any).groupName;
				if (title === linea) {
					this.selection.toggle(obj);
				}
			} else {
				let product = obj as Producto;
				if (product.categoria && product.categoria.nombre === linea) {
					this.selection.toggle(product);
				}
			}
		});
	}

	private wholeProductGroupIsSelected(linea: string): boolean {
		let isSelected = true;
		this.productsDataSource.data.forEach(obj => {
			if (!this.isGroupTitle(obj)) {
				let product = obj as Producto;
				if (product.categoria && product.categoria.nombre === linea) {
					if (isSelected) {
						isSelected = isSelected && this.selection.isSelected(product);
					}
				}
			}
		});
		return isSelected;
	}

	private someProductsFromGroupIsSelected(linea: string): boolean {
		let isSelected = false;
		this.productsDataSource.data.forEach(obj => {
			if (!this.isGroupTitle(obj)) {
				let product = obj as Producto;
				if (product.categoria && product.categoria.nombre === linea) {
					isSelected = isSelected || this.selection.isSelected(product);
				}
			}
		});
		return isSelected;
	}

	public groupIsIndeterminate(obj: any): boolean {
		if (this.isGroupTitle(obj)) {
			return (
				this.someProductsFromGroupIsSelected(obj.groupName) && !this.wholeProductGroupIsSelected(obj.groupName)
			);
		} else {
			return false;
		}
	}

	private findGroupObject(linea: string): any {
		let ret;
		this.productsDataSource.data.forEach(obj => {
			if (this.isGroupTitle(obj)) {
				let group = obj as any;
				let title = group.groupName as string;
				if (title.trim() === linea.trim()) {
					ret = group;
				}
			}
		});
		return ret;
	}

	public allProductsSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.productsDataSource.data.length;
		return numSelected === numRows;
	}

	public selectAll(): void {
		this.allProductsSelected()
			? this.selection.clear()
			: this.productsDataSource.data.forEach(row => this.selection.select(row));
	}

	private emitProducts(): void {
		let filteredProducts = this.productsToOutput.filter(product => {
			return !this.isGroupTitle(product);
		});
		this.productosOut.emit(filteredProducts);
		this.productsToOutput = [];
	}

	public handleFilterChange(event): void {
		this.selectedFilters = event;
		this.filterProducts();
	}
}
