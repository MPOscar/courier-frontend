import { ENTER } from '@angular/cdk/keycodes';
import {
	Component,
	ElementRef,
	Input,
	OnInit,
	TemplateRef,
	ViewChild,
	HostListener,
	Output,
	EventEmitter
} from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AppConfig } from 'app/app.config';
import { ProductsDatabase, ProductsDataSource } from 'app/data-sources';
import { ProductoCatalogo, Categoria, Presentacion, Producto, Empaque } from 'app/models';
import {
	AlertService,
	AuthenticationService,
	CategoriasService,
	PresentacionesService,
	ProductosService,
	ProviderExportService,
	TiendaInglesaExportService
} from 'app/services';
import { DialogService } from 'app/services/dialog.service';
import { ExportService } from 'app/services/export.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { DialogData } from 'app/models/DialogData/DialogData';
import { ExcelUploadComponent } from 'app/shared/excel-upload/excel-upload.component';
import { HttpErrorResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';

@Component({
	selector: 'app-tabla-catalogo',
	templateUrl: './tabla-catalogo.component.html',
	styleUrls: ['./tabla-catalogo.component.scss']
})
export class TablaCatalogoComponent implements OnInit {
	private _selectedFilters: BehaviorSubject<string[]>;
	public selectedFilters: string[] = [];
	panelOpenState = true;

	@Input()
	set selectedFiltersInput(filters: BehaviorSubject<string[]>) {
		this._selectedFilters = filters;
		filters.subscribe(x => {
			this.resetearProductoDetalle();
		});
	}

	get selectedFiltersInput(): BehaviorSubject<string[]> {
		return this._selectedFilters;
	}

	@Input() catalogoOtros: boolean;
	@Input() proveedorId: number = 0;
	@Output() productosEmitter: EventEmitter<Producto[]> = new EventEmitter();
	@Output() productoDetalleEmitter: EventEmitter<Producto> = new EventEmitter();

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild('filter', { static: true }) filter: ElementRef;
	@ViewChild('exportDialogTemplate') exportDialogTemplate: TemplateRef<any>;
	@ViewChild('excelUploadTemplate') excelUploadTemplate: TemplateRef<any>;
	@ViewChild('excelDeleteTemplate') excelDeleteTemplate: TemplateRef<any>;
	@ViewChild('fileInput', { static: true }) fileInput: ElementRef;

	productos: ProductoCatalogo[];
	productoDetalle: ProductoCatalogo;
	productLength: number;
	detallesRow: number;
	canEdit: boolean = false;
	deleteMode: boolean = false;
	loaderVisible: boolean = true;
	displayedColumns = ['cpp', 'descripcion', 'marca', 'division', 'linea'];
	separatorKeysCodes = [ENTER];
	checked: boolean[] = [false, false, false, false];
	presentaciones: Presentacion[];
	categorias: Categoria[] = [];
	productosDatabase: ProductsDatabase;
	dataSource: ProductsDataSource | null;

	categoriesSubscription: Subscription;
	presentationsSubscription: Subscription;
	productsSubscription: Subscription;
	loading: any;
	progressButtonOptions: MatProgressButtonOptions = {
		active: false,
		text: 'Cargar',
		spinnerSize: 18,
		raised: true,
		stroked: false,
		buttonColor: 'primary',
		spinnerColor: 'primary',
		fullWidth: false,
		disabled: false,
		mode: 'indeterminate'
	};

	selection = new SelectionModel<Producto>(true, []);
	selectionAmount = 0;
	storeData: any;
	jsonData: any;
	excelDeleteFile: File;
	deleteWorksheet: any;

	businessesExportType: object[] = [
		//{ id: 1, name: 'Tata Logística' },
		//{ id: 2, name: 'Tata Volumetría' },
		//{ id: 3, name: 'Tienda Inglesa' },
		{ id: 4, name: 'Original' }
	];
	selectedExportType: any;
	screenWidth;
	mobileSortAsc: boolean;
	mobileSortCPP = false;

	constructor(
		private authenticationService: AuthenticationService,
		private exportService: ExportService,
		private router: Router,
		private productosService: ProductosService,
		private presentacionesService: PresentacionesService,
		private categoriasService: CategoriasService,
		private alertService: AlertService,
		private dialogService: DialogService,
		private providerExportService: ProviderExportService,
		private tiendaInglesaExportService: TiendaInglesaExportService,
		private config: AppConfig
	) {
		if (
			this.authenticationService.can('editarProductos') ||
			this.authenticationService.can('administradorEmpresa')
		) {
			this.canEdit = true;
		}
		this.onResize();
	}
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	ngOnInit() {
		this.productosDatabase = new ProductsDatabase();
		this.dataSource = new ProductsDataSource(this.productosDatabase, this.paginator, this.sort);

		this.cargarCategorias();

		this.paginator._intl.itemsPerPageLabel = 'Por página';
		this.paginator._intl.getRangeLabel = (page, size, length) => `Pág. ${page + 1} de ${Math.ceil(length / size)}`;
	}

	ngOnDestroy() {
		if (this.presentationsSubscription != null) {
			this.presentationsSubscription.unsubscribe();
		}
		if (this.productsSubscription != null) {
			this.productsSubscription.unsubscribe();
		}
		if (this.categoriesSubscription != null) {
			this.categoriesSubscription.unsubscribe();
		}
	}

	cambiarPagina() {
		this.productosService.pageSize = this.dataSource._paginator.pageSize;
		this.productosService.pageIndex = this.dataSource._paginator.pageIndex + 1;
		this.cargarProductos();
	}

	cargarCategorias() {
		this.categoriesSubscription = this.categoriasService.getCategoriesApi().subscribe(response => {
			this.categorias = response.data;
			this.categorias.forEach(cat => {
				if (typeof cat.padre == 'number') {
					cat.padre = response.data.find(c => c.id == cat.padre);
				}
			});
			this.cargarPresentaciones();
		});
	}

	cargarPresentaciones() {
		this.presentationsSubscription = this.presentacionesService.getPresentaciones().subscribe(response => {
			this.presentaciones = response;
			this.cargarProductos();
		});
	}

	cargarProductos() {
		if (this.catalogoOtros != undefined && this.catalogoOtros === false) {
			this.productsSubscription = this.productosService.getProductosApi().subscribe(productos => {
				if (productos.data) {
					this.productLength = productos.total;
					this.loaderVisible = true;
					this.productos = productos.data;
					this.productosService.setProductos(productos.data);

					this.productosDatabase.updateProducts(this.productos);
					this.productosEmitter.emit(productos.data);
					if (productos.data.length > 0) {
						this.productos.forEach(prod => {
							if (typeof prod.categoria == 'number') {
								prod.categoria = this.categorias.find(c => c.id == prod.categoria);
							} else if (prod.categoria != null) {
								if (typeof prod.categoria.padre == 'number') {
									prod.categoria.padre = this.categorias.find(c => c.id == prod.categoria.padre);
								}
							}
						});
						this.detallesRow = 0;
						this.productoDetalle = this.dataSource.renderedData[0];
						this.cargarProductoDetalle(this.productoDetalle.id);
						this.productos.sort(this.sortAscCPP);
						if (this.productosService.backFromDetail) {
							this.productosService.backFromDetail = false;
							this.dataSource._paginator.pageIndex = this.productosService.pageIndex;
							this.dataSource._paginator.pageSize = this.productosService.pageSize;
						}
					}
				} else {
					this.productosService.setLoaderVisibility(false);
				}
				this.productosService.getLoaderVisibility().subscribe(data => {
					this.loaderVisible = data;
				});
			});
		} else {
			this.cargarProductosVisibles();
		}
	}

	cargarProductosVisibles() {
		this.productsSubscription = this.productosService
			.getProductosApiVisibles(this.proveedorId)
			.subscribe(productos => {
				if (productos.data) {
					this.productLength = productos.total;
					this.loaderVisible = true;
					this.productos = productos.data;
					this.productosService.setProductos(productos.data);

					this.productosDatabase.updateProducts(this.productos);
					this.productosEmitter.emit(productos.data);
					if (productos.data.length > 0) {
						this.productos.forEach(prod => {
							if (typeof prod.categoria == 'number') {
								prod.categoria = this.categorias.find(c => c.id == prod.categoria);
							} else if (prod.categoria != null) {
								if (typeof prod.categoria.padre == 'number') {
									prod.categoria.padre = this.categorias.find(c => c.id == prod.categoria.padre);
								}
							}
						});
						this.productoDetalle = this.dataSource.renderedData[0];
						this.cargarProductoDetalle(this.productoDetalle.id);
						this.productos.sort(this.sortAscCPP);
						if (this.productosService.backFromDetail) {
							this.productosService.backFromDetail = false;
							this.dataSource._paginator.pageIndex = this.productosService.pageIndex;
							this.dataSource._paginator.pageSize = this.productosService.pageSize;
						}
					}
				} else {
					this.productosService.setLoaderVisibility(false);
				}
				this.productosService.getLoaderVisibility().subscribe(data => {
					this.loaderVisible = data;
				});
			});
	}

	sortAsc = (a: ProductoCatalogo, b: ProductoCatalogo) => {
		if (a.descripcion.toLowerCase() > b.descripcion.toLowerCase()) {
			return 1;
		} else if (a.descripcion.toLowerCase() < b.descripcion.toLowerCase()) {
			return -1;
		} else {
			return 0;
		}
	};

	sortDesc = (a: ProductoCatalogo, b: ProductoCatalogo) => {
		if (a.descripcion.toLowerCase() < b.descripcion.toLowerCase()) {
			return 1;
		} else if (a.descripcion.toLowerCase() > b.descripcion.toLowerCase()) {
			return -1;
		} else {
			return 0;
		}
	};

	sortAscCPP = (a: ProductoCatalogo, b: ProductoCatalogo) => {
		if (a.cpp > b.cpp) {
			return 1;
		} else if (a.cpp < b.cpp) {
			return -1;
		} else {
			return 0;
		}
	};

	sortDescCPP = (a: ProductoCatalogo, b: ProductoCatalogo) => {
		if (a.cpp < b.cpp) {
			return 1;
		} else if (a.cpp > b.cpp) {
			return -1;
		} else {
			return 0;
		}
	};

	addFiltro(event: MatChipInputEvent): void {
		let input = event.input;
		let value = event.value;
		if (value.trim() != '') {
			if ((value || '').trim()) {
				this.selectedFilters.push(value.trim());
				this.dataSource.filter = this.selectedFilters;
				this.productosService.selectedFilters = this.selectedFilters;
				this.cargarProductos();
			}

			if (input) {
				input.value = '';
			}
			this.resetearProductoDetalle();
		}
	}

	removeFilter(filter) {
		this.selectedFilters.splice(this.selectedFilters.indexOf(filter), 1);
		this.dataSource.filter = this.selectedFilters;
		this.productosService.selectedFilters = this.selectedFilters;
		this.selectedFiltersInput.next(this.selectedFilters);
	}

	seleccionarProducto(row) {
		this.productoDetalle = row;
		if (this.productoDetalle) {
			this.cargarProductoDetalle(this.productoDetalle.id);
		}
		this.productoDetalleEmitter.emit(this.productoDetalle);
	}

	resetearProductoDetalle() {
		this.productosService.sort =
			this.sort.direction === 'asc'
				? this.sort.active
				: this.sort.direction === 'desc'
				? '-' + this.sort.active
				: '';

		this.detallesRow = 0;
		this.productoDetalle = this.dataSource ? this.dataSource.renderedData[0] : null;
		this.seleccionarProducto(null);
		this.cargarProductos();
	}

	detallesProducto(row) {
		this.seleccionarProducto(row);
	}

	cargarProductoDetalle(id) {
		this.productosService.getProductoFromId(id).subscribe(res => {
			this.productoDetalle = res.data;
			this.productosService.selectedProductDetail = res.data;
			this.productoDetalleEmitter.emit(this.productoDetalle);
		});
	}

	goToProductDetail(productId) {
		if (this.productoDetalle != null && this.productoDetalle != undefined) {
			this.router.navigate(['/producto-detalle', productId]);
		}
	}

	goToCreateProduct() {
		this.router.navigate(['/nuevo-producto']);
	}

	exportProducts() {
		let dialogData = new DialogData();
		dialogData.title = 'Exportar products';
		dialogData.type = 'primary';
		dialogData.acceptButtonText = 'Exportar';
		dialogData.template = this.exportDialogTemplate;

		const dialogRef = this.dialogService.open(dialogData);
		dialogRef.afterClosed().subscribe(result => {
			if (result && this.selectedExportType) {
				this.export(this.selectedExportType);
			}
		});
	}

	export(option: any) {
		var business = JSON.parse(localStorage.getItem('business'));
		var businessName = '';
		var id = 3;
		if (business != undefined) {
			id = business.id;
			businessName = business.nombre;
		}
		if (option == 3) {
			this.exportService.setStrategy(this.tiendaInglesaExportService);
			this.exportService.performStrategy(
				this.productosDatabase.data,
				'' + businessName,
				'Exportacion Tienda Inglesa'
			);
		} else if (option == 4) {
			this.productosService.getProductosExportarExcel().subscribe(response => {
				console.log(response.data);
				console.log('exportar');
				const link = document.createElement('a');
				link.target = '_blank';
				link.href = 'https://s3.us-east-2.amazonaws.com/' + response.data;
				link.setAttribute('visibility', 'hidden');
				link.click();
			});
			/*this.exportService.setStrategy(this.providerExportService);
			this.exportService.performStrategy(this.productosDatabase.data, '' + businessName, 'Productos ');*/
		} else {
			const link = document.createElement('a');
			link.target = '_blank';
			link.href = this.config.apiUrl + '/wishlist/misProductos/' + id + '/' + option;
			link.setAttribute('visibility', 'hidden');
			link.click();
		}
	}

	openExcelDialog() {
		let resultSubject = new Subject();
		let dialogRef = this.dialogService.openFromComponent(ExcelUploadComponent, '500px', resultSubject);

		resultSubject.subscribe(res => {
			if (res === true) {
				this.categoriasService.loadCategorias();
				this.productosService.loadProductos();
				this.cargarCategorias();
				dialogRef.close();
			}
		});
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const page = this.dataSource._paginator.pageSize;
		return numSelected === page;
	}

	selectRows() {
		for (let index = 0; index < this.dataSource._paginator.pageSize; index++) {
			this.selection.select(this.dataSource.renderedData[index]);
			this.selectionAmount = this.selection.selected.length;
		}
	}

	masterToggle() {
		this.isAllSelected() ? this.selection.clear() : this.selectRows();
	}

	checkboxLabel(row): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
	}

	deleteProduct(product) {
		if (product != null && product != undefined) {
			try {
				this.productosService.deleteProduct(product.id).subscribe(
					data => {
						this.manageDeleteProduct(data, product);
					},
					error => {
						var httpError = error as HttpErrorResponse;
						if (httpError.status == 401) {
							this.alertService.error('Debes iniciar sesión.', 'OK');
							this.authenticationService.logout();
						} else {
							this.alertService.error('Ocurrió un error.', 'OK');
						}
					}
				);
			} catch (e) {
				this.alertService.error('Ocurrió un error.', 'OK');
			}
		} else {
		}
	}

	manageDeleteProduct = (data: any, product: ProductoCatalogo) => {
		this.productosDatabase.deleteProduct(product);
		if (this.dataSource.filteredData[this.detallesRow] != undefined) {
			this.productoDetalle = this.dataSource.filteredData[this.detallesRow];
		}
		if (this.dataSource.filteredData[this.detallesRow - 1] != undefined) {
			this.productoDetalle = this.dataSource.filteredData[this.detallesRow - 1];
			this.detallesRow--;
		} else if (this.dataSource.filteredData[0] != undefined) {
			this.productoDetalle = this.dataSource.filteredData[0];
			this.detallesRow = 0;
		} else {
			this.productoDetalle = new ProductoCatalogo();
		}
		this.cargarProductos();
	};

	enableDeleteSelect() {
		this.displayedColumns = ['select', 'cpp', 'descripcion', 'marca', 'division', 'linea'];
	}

	cancelDeleteSelect() {
		this.displayedColumns = ['cpp', 'descripcion', 'marca', 'division', 'linea'];
		this.selection = new SelectionModel<Producto>(true, []);
	}

	deleteSelectedProducts() {
		this.deleteMode = false;
		this.deleteProductArray(this.selection.selected);
		this.cancelDeleteSelect();
	}

	openDeleteExcelDialog(): void {
		let dialogData = new DialogData();
		dialogData.noButtons = true;
		dialogData.template = this.excelDeleteTemplate;
		dialogData.width = '500px';

		this.dialogService.open(dialogData);
	}

	uploadedDeleteExcel(event) {
		this.excelDeleteFile = event.target.files[0];
		this.readDeleteExcel();
	}

	readDeleteExcel() {
		let readFile = new FileReader();
		readFile.onload = e => {
			this.storeData = readFile.result;
			var data = new Uint8Array(this.storeData);
			var arr = new Array();
			for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
			var bstr = arr.join('');
			var workbook = XLSX.read(bstr, { type: 'binary' });
			var first_sheet_name = workbook.SheetNames[0];
			this.deleteWorksheet = workbook.Sheets[first_sheet_name];
		};
		readFile.readAsArrayBuffer(this.excelDeleteFile);
	}

	readAsJson() {
		this.jsonData = XLSX.utils.sheet_to_json(this.deleteWorksheet, {
			raw: false,
			range: 'A1:A1000000',
			blankrows: false
		});
		var cppsABorrar = [];
		for (var i in this.jsonData) {
			cppsABorrar.push(this.jsonData[i].CPP);
		}
		this.deleteProductsFromCPPArray(cppsABorrar);
		this.excelDeleteFile = null;
	}

	//TODO: cambiar cuando exista llamado de API que cumpla esta función
	deleteProductsFromCPPArray(aBorrar) {
		let productArray: Producto[] = [];
		let productErrorArray = [];
		for (let i = 0; i < aBorrar.length; i++) {
			let productToAdd = this.productosService.getProducto(aBorrar[i]);
			if (productToAdd) {
				productArray.push(productToAdd);
			} else {
				productErrorArray.push(aBorrar[i]);
			}
		}
		if (productArray.length > 0) {
			this.deleteProductArray(productArray);
		} else {
			this.alertService.error('No se eliminó ningún producto.', 'OK');
		}
		if (productErrorArray.length > 0) {
			this.writeErrorExcel(productErrorArray);
			if (productArray.length > 0) {
				this.alertService.error('No se eliminaron algunos productos.', 'OK');
			}
		}
	}

	getFormattedDate() {
		return formatDate(Date.now(), 'dd-MM-yyyy-hh_mm_ss', 'en-US');
	}

	writeErrorExcel(productErrorArray) {
		let workbook = XLSX.utils.book_new();
		let ws = XLSX.utils.aoa_to_sheet([['CPP', 'Fecha: ' + this.getFormattedDate()]]);
		ws['!merges'] = [{ s: { c: 1, r: 0 }, e: { c: 3, r: 0 } }];
		ws['!cols'] = [{ wpx: 150 }];
		this.addCellsFromArray(productErrorArray, ws);
		XLSX.utils.book_append_sheet(workbook, ws, 'CPPs');
		XLSX.writeFile(workbook, 'error-eliminacion-' + this.getFormattedDate() + '.xlsx');
	}

	addCellsFromArray(productErrorArray, ws) {
		for (let i = 0; i < productErrorArray.length; i++) {
			XLSX.utils.sheet_add_aoa(ws, [[productErrorArray[i]]], { origin: { r: i + 1, c: 0 } });
		}
	}

	deleteProductArray(aBorrar) {
		for (let i = 0; i < aBorrar.length; i++) {
			this.deleteProduct(aBorrar[i]);
		}
		this.alertService.success('Productos eliminados.', 'OK');
	}

	sortMobile() {
		if (this.mobileSortAsc) {
			this.doSortAsc();
			this.mobileSortAsc = false;
		} else {
			this.doSortDesc();
			this.mobileSortAsc = true;
		}
	}

	doSortAsc() {
		if (this.mobileSortCPP) {
			this.dataSource.filteredData.sort(this.sortDescCPP);
		} else {
			this.dataSource.filteredData.sort(this.sortDesc);
		}
	}

	doSortDesc() {
		if (this.mobileSortCPP) {
			this.dataSource.filteredData.sort(this.sortAscCPP);
		} else {
			this.dataSource.filteredData.sort(this.sortAsc);
		}
	}
}
