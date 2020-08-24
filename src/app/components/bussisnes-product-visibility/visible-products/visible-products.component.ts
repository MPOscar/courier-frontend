import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ENTER } from '@angular/cdk/keycodes';
//
import { Subscription } from 'rxjs';
//
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
//
import { MixedDataSource } from 'app/data-sources';
import { MixedDatabase } from 'app/data-sources/mixed-database';
import { Producto } from 'app/models';
import { CategoriasService, AuthenticationService, AlertService, ProductosService } from 'app/services';
import { AppConfig } from 'app/app.config';

@Component({
	selector: 'visible-products',
	templateUrl: './visible-products.component.html',
	styleUrls: ['./visible-products.component.scss']
})
export class VisibleProductsComponent implements OnInit {
	@Input() products: Producto[] = [];

	@Output() deleteVisibilityEventEmitter: EventEmitter<any> = new EventEmitter();

	@ViewChild('paginator', { static: true }) paginator: MatPaginator;

	@ViewChild('addedPaginator', { static: true }) addedPaginator: MatPaginator;

	@ViewChild('sort', { static: true }) sort: MatSort;

	@ViewChild('sortGroups', { static: true }) sortGroups: MatSort;

	// A
	addedSelection = new SelectionModel<Producto>(true, []);

	addedProducts: Producto[] = [];

	allProducts: Producto[] = [];

	addedDataSource: MixedDataSource;

	addedDatabase: MixedDatabase;

	addedProductsArray: any[] = new Array<any>();

	addedDisplayedColumns = ['checkbox', 'imagen', 'cpp', 'descripcion', 'gtin', 'marca', 'linea'];

	allProductsArray: any[] = new Array<any>();

	addedProductsLength = 0;

	//C
	categorySubscription: Subscription;

	//D
	displayedColumns = ['checkbox', 'cpp', 'descripcion', 'marca', 'division', 'linea'];

	displayedColumnsGroups = ['nombre', 'quitar'];

	detallesRow: number = 0;

	//I
	inputFocused: boolean;

	isExtendedRow = (index, item) => item.extend;

	//M
	matSelectText: String = '';

	//P
	productsDatabase: MixedDatabase;

	productsDataSource: MixedDataSource | null;

	productsWithoutFilter: Producto[] = [];

	productsWithFilter: Producto[] = [];

	productsToAdd: Producto[] = new Array<Producto>();

	productsToRemove: Producto[] = new Array<Producto>();

	productsLength = 0;

	//S
	separatorKeysCodes = [ENTER];

	selectedFilters: string[] = [];

	selection = new SelectionModel<Producto>(true, []);

	showAddedProducts: boolean = false;

	constructor(
		private alertService: AlertService,
		private authenticationService: AuthenticationService,
		private categoryService: CategoriasService,
		private cdRef: ChangeDetectorRef,
		private productosService: ProductosService,
		public appConfig: AppConfig
	) {}

	ngOnInit() {
		this.initializeVariables();
	}

	subscribeToServices() {
		this.categorySubscription = this.categoryService.dataChange.subscribe(changed => {
			if (changed) {
				this.productsDatabase.data.forEach(product => {
					if (product.categoria != undefined) {
						if (product.categoria.nombre == undefined) {
							var cat = this.categoryService.getCategory(product.categoria);
							if (cat != undefined) product.categoria = cat;
						}
					}
				});
			}
		});
	}

	initializeVariables() {
		this.addedDatabase = new MixedDatabase();

		this.productsDatabase = new MixedDatabase();
		this.productsDataSource = new MixedDataSource(this.productsDatabase, this.paginator, this.sortGroups);

		this.cargarProductos();

		this.paginator._intl.itemsPerPageLabel = 'Por página';
		this.paginator._intl.getRangeLabel = (page, size, length) => `Pág. ${page + 1} de ${Math.ceil(length / size)}`;
	}

	compareProductsByDiv(p1, p2) {
		if (p1.categoria.nombre < p2.categoria.nombre) return -1;
		if (p1.categoria.nombre > p2.categoria.nombre) return 1;
		return 0;
	}

	removeFromAdded(p: any, fromCategory = false, categoryValue = false) {
		if (p.id != undefined) {
			var product = p as Producto;
			if (!fromCategory || (fromCategory && this.addedSelection.isSelected(p) != categoryValue)) {
				this.addedSelection.toggle(p);
				if (this.productsToRemove.indexOf(product) == -1) this.productsToRemove.push(product);
				else this.productsToRemove.splice(this.productsToRemove.indexOf(product), 1);
			}
		} else {
			this.addedSelection.toggle(p);

			var categoryTitle = p.descripcion;
			var productsInCategory = this.addedDataSource.filteredData.filter(
				product => product.categoria != undefined && product.categoria.nombre == categoryTitle
			);
			productsInCategory.forEach(prod => {
				this.removeFromAdded(prod, true, this.addedSelection.isSelected(p));
			});
		}
	}

	addProduct(p: any) {
		this.selection.toggle(p);
		if (p.id != undefined) {
			var product = p as Producto;
			if (this.productsToAdd.indexOf(product) == -1) this.productsToAdd.push(product);
			else this.productsToAdd.splice(this.productsToAdd.indexOf(product), 1);
		} else {
			var categoryTitle = p.descripcion;
			var productsInCategory = this.productsDataSource.filteredData.filter(
				product => product.categoria != undefined && product.categoria.nombre == categoryTitle
			);
			productsInCategory.forEach(prod => {
				this.addProduct(prod);
			});
		}
	}

	removeProducts() {
		this.addedSelection.clear();
		this.productsToRemove.forEach(product => {
			this.removeFromList(product);
		});
		this.filterProducts();
		this.productsDatabase.data.splice(0, this.productsDatabase.data.length);
		this.productsWithFilter.forEach(product => {
			this.productsDatabase.add(product);
		});
		this.loadAllProductsTable();
		this.loadAddedTable();
		this.productsToRemove = new Array<Producto>();
		this.updateChosenProducts();
		this.addedProductsLength = this.addedDataSource.filteredData.length;
		if (this.addedProductsLength == 0) {
			this.showAddedProducts = false;
		} else this.showAddedProducts = true;
	}

	selectProducts() {
		this.selection.clear();
		this.productsToAdd.forEach(product => {
			this.addProductToVisible(product);
		});
		this.filterProducts();
		this.productsDatabase.data.splice(0, this.productsDatabase.data.length);
		this.productsWithFilter.forEach(product => {
			this.productsDatabase.add(product);
		});
		this.loadAllProductsTable();
		this.loadAddedTable();
		this.productsToAdd = new Array<Producto>();
		this.updateChosenProducts();
		this.addedProductsLength = this.addedDatabase.data.length;
		if (this.addedProductsLength == 0) {
			this.showAddedProducts = false;
		} else this.showAddedProducts = true;
	}

	isAllSelectedAdded() {
		const numSelected = this.addedSelection.selected.length;
		const numRows = this.addedDataSource.filteredData.length;
		return numSelected === numRows;
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.productsDataSource.filteredData.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggleAdded() {
		if (this.isAllSelectedAdded()) {
			this.productsToRemove = new Array<Producto>();
			this.addedSelection.clear();
		} else {
			this.addedDataSource.filteredData.forEach(product => {
				this.addedSelection.select(product);
				if (this.productsToRemove.indexOf(product) == -1) this.productsToRemove.push(product);
			});
		}
	}

	masterToggle() {
		if (this.isAllSelected()) {
			this.productsToAdd = new Array<Producto>();
			this.selection.clear();
		} else {
			this.productsDataSource.filteredData.forEach(product => {
				this.selection.select(product);
				if (this.productsToAdd.indexOf(product) == -1) this.productsToAdd.push(product);
			});
		}
	}

	filterProducts() {
		this.productsWithFilter = this.productsWithoutFilter.slice().filter((item: any) => {
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
	}

	cambiarPagina() {
		//this.saleListService.pageIndex = this.productsDataSource._paginator.pageIndex;
		//this.saleListService.pageSize = this.productsDataSource._paginator.pageSize;
	}

	cambiarPaginaAdded() {
		//	this.saleListService.pageIndex = this.productsDataSource._paginator.pageIndex;
		//	this.saleListService.pageSize = this.productsDataSource._paginator.pageSize;
	}

	removeFilter(filter) {
		this.selectedFilters.splice(this.selectedFilters.indexOf(filter), 1);
		this.filterProducts();
		this.productsDatabase.data.splice(0, this.productsDatabase.data.length);
		this.productsWithFilter.forEach(product => {
			this.productsDatabase.add(product);
		});
		this.loadAllProductsTable();
	}

	addFiltro(event: MatChipInputEvent): void {
		let input = event.input;
		let value = event.value;
		if (value.trim() != '') {
			if ((value || '').trim()) {
				this.selectedFilters.push(value.trim());
				this.filterProducts();

				this.productsDatabase.data.splice(0, this.productsDatabase.data.length);
				this.productsWithFilter.forEach(product => {
					this.productsDatabase.add(product);
				});
				this.loadAllProductsTable();
				//	this.productsDataSource.filter = this.selectedFilters;
			}

			if (input) {
				input.value = '';
			}
		}
	}

	cargarProductos() {
		this.productosService.getProductos().subscribe(productos => {
			productos.forEach(product => {
				/*if (product.categoria != undefined) {
					if (product.categoria.nombre == undefined) {
						var cat = this.categoryService.getCategory(product.categoria.id);
						if (cat != undefined) product.categoria = cat;
					}
				}*/
			});
			productos.forEach(product => {
				this.productsDatabase.add(product);
				this.productsWithoutFilter.push(product);
				this.productsWithFilter.push(product);
			});

			this.loadAllProductsTable();
			this.productsLength = this.productsDataSource.filteredData.length;
		});
	}

	loadAllProductsTable() {
		this.allProducts = [];
		this.allProductsArray = new Array<any>();
		this.productsDatabase.data.forEach(product => {
			if (product.id != undefined) {
				if (product.categoria != undefined) {
					if (product.categoria.nombre == undefined) {
						var cat = this.categoryService.getCategory(product.categoria);
						if (cat != undefined) product.categoria = cat;
					}
				}

				this.allProducts.push(product);
			}
		});
		this.allProducts.sort(this.compareProductsByDiv);
		this.loadAllProductsArray();
	}

	loadAllProductsArray() {
		if (this.allProducts.length > 0) {
			var firstProduct = this.allProducts[0];
			var firstTitle: any = new Object();
			firstTitle.extend = true;
			firstTitle.descripcion = firstProduct.categoria.nombre;
			firstTitle.nombre = firstProduct.categoria.nombre;
			firstTitle.productos = firstProduct.categoria.productos;

			this.allProductsArray.push(firstTitle);
			var actualTitleText = firstProduct.categoria.nombre;
			this.allProducts.forEach(product => {
				if (product.categoria.nombre == actualTitleText) {
					this.allProductsArray.push(product);
				} else {
					var actualProduct = product;
					var actualTitle: any = new Object();
					actualTitle.extend = true;
					actualTitle.descripcion = actualProduct.categoria.nombre;
					actualTitle.nombre = actualProduct.categoria.nombre;
					actualTitle.productos = actualProduct.categoria.productos;
					this.allProductsArray.push(actualTitle);
					this.allProductsArray.push(product);
					actualTitleText = product.categoria.nombre;
				}
			});
		}
		this.productsDatabase.update(this.allProductsArray);
	}

	updateChosenProducts() {
		var prods = [];
		this.addedDatabase.data.forEach(product => {
			if (product.id != undefined) {
				if (product.categoria.nombre == undefined) {
					var cat = this.categoryService.getCategory(product.categoria);
					product.categoria = cat;
				}
				prods.push(product);
			}
			this.addedDatabase.delete(product);
		});
		if (prods.length == this.products.length) {
			this.deleteVisibilityEventEmitter.emit(true);
			this.products = [];
		} else {
			let productsArray = [];
			this.products.forEach(product => {
				let flag = true;
				let index = prods.forEach(item => {
					if (item.id == product.id) {
						flag = false;
					}
				});
				if (flag) productsArray.push(product);
			});
			this.products = productsArray;
		}
		this.productosService.productsForMassiveVisibility = prods;
		if (this.productosService.productsForMassiveVisibility.length > 0) {
			this.productosService.productsForMassiveVisibilityChosen = true;
		} else {
			this.productosService.productsForMassiveVisibilityChosen = false;
		}
	}

	loadAddedTable() {
		this.addedProducts = [];
		this.addedProductsArray = new Array<any>();
		this.addedDatabase.data.forEach(product => {
			if (product.id != undefined) {
				if (product.categoria.nombre == undefined) {
					var cat = this.categoryService.getCategory(product.categoria);
					if (cat != undefined) product.categoria = cat;
				}
				this.addedProducts.push(product);
			}
		});
		this.addedProducts.sort(this.compareProductsByDiv);
		this.loadProductsArray();
	}

	loadProductsArray() {
		if (this.addedProducts.length > 0) {
			var firstProduct = this.addedProducts[0];
			var firstTitle: any = new Object();
			firstTitle.extend = true;
			firstTitle.descripcion = firstProduct.categoria.nombre;
			firstTitle.nombre = firstProduct.categoria.nombre;
			firstTitle.productos = firstProduct.categoria.productos;
			this.addedProductsArray.push(firstTitle);
			var actualTitleText = firstProduct.categoria.nombre;
			this.addedProducts.forEach(product => {
				if (product.categoria.nombre == actualTitleText) {
					this.addedProductsArray.push(product);
				} else {
					var actualProduct = product;
					var actualTitle: any = new Object();
					actualTitle.extend = true;
					actualTitle.descripcion = actualProduct.categoria.nombre;
					actualTitle.nombre = actualProduct.categoria.nombre;
					actualTitle.productos = actualProduct.categoria.productos;
					this.addedProductsArray.push(actualTitle);
					this.addedProductsArray.push(product);
					actualTitleText = product.categoria.nombre;
				}
			});
		}
		this.addedDatabase.update(this.addedProductsArray);
	}

	addProductToVisible(product: any) {
		if (product != null) {
			if (product.id != undefined) {
				this.productsDatabase.delete(product);
				var index = this.productsWithoutFilter.indexOf(product);
				if (index != -1) {
					this.productsWithoutFilter.splice(index, 1);
				}

				this.addedDatabase.add(product);
			}
		}
	}

	removeFromList(product: any) {
		if (product != null) {
			if (product.id != undefined) {
				this.productsDatabase.add(product);
				this.productsWithoutFilter.push(product);
				this.addedDatabase.delete(product);
			}
		}
	}

	eliminarVisibilidad() {
		this.selectProducts();
		try {
			this.productosService.saveMassiveVisibility(false).subscribe(data => {});
		} catch (e) {
			this.alertService.error('Ocurrió un error: ' + e);
		}
	}
}
