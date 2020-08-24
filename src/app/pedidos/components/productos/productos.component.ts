import { animate, state, style, transition, trigger } from '@angular/animations';
import { ENTER } from '@angular/cdk/keycodes';

import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	TemplateRef
} from '@angular/core';

import { MatChipInputEvent } from '@angular/material/chips';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaDeVenta, Producto } from 'app/models';
import { Filtro, ProductoCarrito, Proveedor } from 'app/pedidos/models';
import { Plantilla } from 'app/pedidos/models/Orden/Plantilla';
import { TipoFiltro } from 'app/pedidos/models/Filtro/TipoFiltro';
import { CarritoService, ProductosService, ProveedoresService, OrdenesService } from 'app/pedidos/services';
import { SaleListService } from 'app/services';
import { Utils } from 'app/utils/Utils';
import { Observable, Subject, forkJoin } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap } from 'rxjs/operators';

import { InfoDialogComponent } from 'app/pedidos/components/pedido/info-dialog/info-dialog.component';
import { PlantillasComponent } from 'app/pedidos/components/plantillas/plantillas.component';
import { DialogService } from 'app/services/dialog.service';
import { DialogData } from 'app/models/DialogData/DialogData';

export class Group {
	level = 0;
	_parent: Group;
	expanded = true;
	totalCounts = 0;
	division?: string;
	marca?: string;
	linea?: string;

	set parent(parent: Group) {
		this._parent = parent;
	}
	get parent() {
		return this._parent;
	}
	get visible(): boolean {
		return !this.parent || (this.parent.visible && this.parent.expanded);
	}

	set visible(visible: boolean) {
		if (this.parent) {
			this.parent.expanded = visible;
			this.parent.visible = visible;
		}
	}
}

export class SortDataForGroup {
	active: string;
	direction: string;
}
export class marcaLinea {
	marca: string;
	linea: string;
	division: string;
}
export interface IField {
	field: string;
	label: string;
	visible: boolean;
	tooltip?: string;
	hiddable?: boolean;
	columnOrder: number;
}

@Component({
	selector: 'app-productos',
	templateUrl: 'productos.component.html',
	styleUrls: ['productos.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0', opacity: 0 })),
			state('expanded', style({ height: '*', opacity: 1 })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
		]),
		trigger('buttonRotate', [
			state('default', style({ transform: 'rotate(0)' })),
			state('rotated', style({ transform: 'rotate(-180deg)' })),
			transition('rotated => default', animate('200ms ease-out')),
			transition('default => rotated', animate('200ms ease-in'))
		]),
		trigger('collapseChange', [
			state('true', style({ height: '0', overflow: 'hidden' })),
			state('false', style({ height: '*' })),
			transition('* => *', animate('.25s ease-in'))
		])
	]
})
export class ProductosComponent implements OnInit, OnDestroy {
	/**
	 * Observable del que se obtienen los Productos que deben ser utilizados a
	 * nivel de Componente para evitar multiples fuentes de datos
	 *
	 * @type {Observable<Producto[]>}
	 * @memberof ProductosComponent
	 */
	public productos$: Observable<Producto[]>;

	/**
	 * Utilizado para definir a nivel de componente que se desea actualizar
	 * los Productos a partir del estado actual
	 *
	 * @type {BehaviorSubject<boolean>}
	 * @memberof ProductosComponent
	 */
	public actualizarProductos$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	/**
	 * Utilizado para definir a nivel de componente que se desea actualizar
	 * los datos del Proveedor y por consiguiente las Listas de Venta disponibles
	 *
	 * @type {BehaviorSubject<boolean>}
	 * @memberof ProductosComponent
	 */
	public actualizarListaVenta$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	/**
	 * Observable utilizado para controlar cuando se debe llamar el método
	 * unsubscribe en las Subscripciones generadas en el Componente.
	 * También puede ser utilizado para el operador takeUntil() (Recomendado para no tener que guardar las
	 * subscripciones )
	 *
	 * @private
	 * @memberof ProductosComponent
	 */
	private componenteDestruido$ = new Subject<void>();

	/**
	 * Variable para guardar los Observables a los Input generados dinámicamente para insertar las cantidades de los productos
	 *
	 * @private
	 * @memberof ProductosComponent
	 */
	private obsCant$ = {};

	public idProveedor: number;
	public proveedores: BehaviorSubject<Proveedor[]> = new BehaviorSubject<Proveedor[]>([]);
	public listasVenta: BehaviorSubject<ListaDeVenta[]> = new BehaviorSubject<ListaDeVenta[]>([]);
	public carrito: ProductoCarrito[] = [];
	public filtros: Filtro[] = [];
	private _moneda = '';

	public unidadMenor = true;
	public listaVenta: ListaDeVenta;

	public tiposFiltros: TipoFiltro[] = [];

	productosDataSource: MatTableDataSource<Producto | Group>;
	public productoSeleccionado: Producto | null;
	productosSinGrupos: Producto[] = [];

	plantilla: Plantilla;
	actualizando: boolean = false;
	mostrarPlantillas: boolean = false;

	collapsedGroups: Array<String> = [];
	collapsedMarcaLinea: Array<marcaLinea> = [];

	@ViewChild(MatTable) productosTable: MatTable<Element>;
	@ViewChild(MatPaginator, { static: true }) productosPaginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) productosSort: MatSort;
	@ViewChild(MatDrawer) carritoSidenav: MatDrawer;
	@ViewChild('plantilla') plantillaSidenav: MatDrawer;
	@ViewChild(PlantillasComponent)
	plantillasComponent: PlantillasComponent;
	@ViewChild('leyendaTemplate') leyendaTemplate: TemplateRef<any>;

	selectedMarcas = [];
	selectedDivisiones = [];
	selectedLineas = [];

	otrosFiltros = [];

	_filtrosActivos = new BehaviorSubject([]);
	columns: IField[] = [
		{
			field: 'imagen',
			label: 'Imagen',
			visible: true,
			tooltip: 'Imagen Ilustrativa del Producto',
			hiddable: false,
			columnOrder: 0
		},
		{
			field: 'cantidad',
			label: 'Cantidad',
			visible: true,
			tooltip: 'Cantidad Solicitada en Unidad del Pedido',
			hiddable: false,
			columnOrder: 1
		},
		{
			field: 'sevende',
			label: 'Se Vende de a',
			visible: true,
			tooltip: 'Cantidad de Unidades Minimas a Pedir',
			hiddable: true,
			columnOrder: 2
		},
		{
			field: 'cantidadunidades',
			label: 'Cantidad Unidades',
			visible: true,
			tooltip: 'Cantidad de Unidades Total',
			hiddable: true,
			columnOrder: 3
		},
		{
			field: 'descripcion',
			label: 'Descripción',
			visible: true,
			tooltip: 'Descripcion del Producto',
			hiddable: true,
			columnOrder: 4
		},
		{
			field: 'moneda',
			label: 'Moneda',
			visible: false,
			tooltip: 'Moneda del Producto',
			hiddable: true,
			columnOrder: 5
		},
		{
			field: 'precio',
			label: 'Precio',
			visible: true,
			tooltip: 'Precio Unitario del Producto',
			hiddable: true,
			columnOrder: 6
		},
		{
			field: 'importe',
			label: 'Importe',
			visible: true,
			tooltip: 'Importe Total del Pedido',
			hiddable: true,
			columnOrder: 7
		},
		{
			field: 'marca',
			label: 'Marca',
			visible: true,
			tooltip: 'Marca del Producto',
			hiddable: true,
			columnOrder: 8
		},
		{
			field: 'linea',
			label: 'Línea',
			visible: true,
			tooltip: 'Linea del Producto',
			hiddable: true,
			columnOrder: 9
		},
		{
			field: 'contenido',
			label: 'Contenido',
			visible: true,
			tooltip: 'Contenido del Producto',
			hiddable: true,
			columnOrder: 10
		},
		{
			field: 'cpp',
			label: 'CPP',
			visible: true,
			tooltip: 'Codigo Interno del Proveedor del Producto',
			hiddable: true,
			columnOrder: 11
		},
		{
			field: 'cajaspallet',
			label: 'Cajas X Pallet',
			visible: false,
			tooltip: 'Cajas Por Pallet',
			hiddable: true,
			columnOrder: 12
		}
	];
	groupByColumns: string[] = ['division'];

	public mostrarIndicadorCargando = true;
	private tareasOcupadas = {};
	hoveredRow: number;
	inputFocused: boolean;
	separatorKeysCodes = [ENTER];
	discontinuados: boolean = false;
	suspendidos: boolean = false;
	ocultarDiscontinuados: boolean = false;
	ocultarSuspendidos: boolean = false;
	sortDataForGroup: SortDataForGroup = new SortDataForGroup();
	sortDirection = '';

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private productosService: ProductosService,
		private carritoService: CarritoService,
		private proveedoresService: ProveedoresService,
		private listaVentaService: SaleListService,
		private ordenesService: OrdenesService,
		iconRegistry: MatIconRegistry,
		sanitizer: DomSanitizer,
		private ref: ChangeDetectorRef,
		public dialog: MatDialog,
		private dialogService: DialogService
	) {
		iconRegistry.addSvgIcon(
			'carrito_flecha',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/carrito_flecha.svg')
		);

		this.idProveedor = this.route.snapshot.params['proveedor'];
		localStorage.setItem('proveedorId', this.idProveedor.toString());
		this.productosDataSource = new MatTableDataSource<Producto | Group>([]);
		this.productos$ = this.actualizarProductos$
			.asObservable()
			.filter(e => e !== false)
			.pipe(
				tap(e => {
					this.mostrarLoader('productos', true);
					this.productosDataSource.data = [];
				})
			)
			.debounceTime(1000)
			.switchMap(e => {
				if (this.listaVenta == null && this.listaVenta == undefined) {
					return Observable.of([]);
				}
				return this.productosService
					.updateProductos(
						this.listaVenta.id,
						this.moneda,
						this.unidadMenor ? 'S' : 'N',
						this.discontinuados,
						this.suspendidos,
						this.ocultarDiscontinuados,
						this.ocultarSuspendidos
					)
					.skip(1);
			})
			.map(productos => {
				productos.forEach(prod => {
					prod.proveedor = this.idProveedor;
				});
				return productos;
			})
			.pipe(tap(e => this.mostrarLoader('productos', false), e => this.mostrarLoader('productos', false)))
			.share();
	}
	public expandirFila(row) {
		if (this.productoSeleccionado == row) {
			this.productoSeleccionado = null;
			return;
		}
		this.mostrarLoader('expandir', true);
		this.cargarDatosExtraProductos(row).subscribe(
			e => {
				this.mostrarLoader('expandir', false);
				const datos = this.productosDataSource.data;
				for (let index = 0; index < datos.length; index++) {
					const p = datos[index];
					if (p['id'] != null && p['id'] != undefined && e['id'] === p['id']) {
						datos[index] = Object.assign({}, datos[index]);
						this.productoSeleccionado =
							this.productoSeleccionado == datos[index] ? null : <Producto>datos[index];
					}
				}

				this.productosDataSource.data = datos;
				this.productosTable.renderRows();
				this.ref.markForCheck();
			},
			error => {
				this.mostrarLoader('expandir', false);
				this.productoSeleccionado = this.productoSeleccionado == row ? null : row;
			}
		);
	}

	private cargarDatosExtraProductos(producto: Producto): Observable<Producto> {
		if (producto instanceof Group) return Observable.of(producto);
		const empaques =
			producto.empaques != null && producto.empaques != undefined
				? Observable.of(producto.empaques)
				: this.productosService.getEmpaques(producto.proveedor, producto.id);
		const pallet =
			producto.pallet != null && producto.pallet != undefined
				? Observable.of(producto.pallet)
				: this.productosService.getPallet(this.idProveedor, producto.id);
		return Observable.forkJoin(empaques, pallet).map(([e, p], n) => {
			producto.pallet = p;
			producto.empaques = e;
			return producto;
		});
	}

	ngOnDestroy(): void {
		this.componenteDestruido$.next();
		this.componenteDestruido$.complete();
	}

	ngOnInit() {
		this.subscripcionListaVentas();
		this.subscripcionProductos();
		this.subscripcionesVarias();

		this.productosDataSource.sort = this.productosSort;
		this.productosDataSource.filterPredicate = this.customFilterPredicate.bind(this);
		this.productosDataSource.sortData = this.sortData.bind(this);
		this.refrescarListasDeVentas();

		this.ordenesService.obtenerUltimaPlantilla().subscribe(response => {
			this.carritoService.empty();
			this.plantilla = response.data;
			this.ordenesService.plantillaId = this.plantilla.id;
		});
	}

	actualizarPlantilla() {
		let count = 0;
		let mensaje = '';
		var mapaListaVentaProdutos = new Map();
		this.plantilla.productos.forEach(element => {
			mapaListaVentaProdutos[element.listaVenta] = mapaListaVentaProdutos[element.listaVenta] || [];
			mapaListaVentaProdutos[element.listaVenta].push(element.idProducto);
			let productoParam: ProductoCarrito = this.productosSinGrupos.find(item => {
				return item.id === element.idProducto;
			});
		});

		let request = [];
		for (let key in mapaListaVentaProdutos) {
			if (mapaListaVentaProdutos.hasOwnProperty(key)) {
				request.push(
					this.productosService.getFromProviderPedidoProductosPlantilla(
						key,
						mapaListaVentaProdutos[key],
						this.moneda,
						this.unidadMenor ? 'S' : 'N'
					)
				);
			}
		}

		const listasVentaArray = this.listasVenta.getValue();
		forkJoin(request).subscribe(responsesRequest => {
			let productos = [];
			const responses: any[] = responsesRequest;
			responses.forEach(response => {
				productos = [...productos, ...response.data];
			});

			const productosMapeados = this.productosService.mapearProductos(productos, this.moneda);
			this.plantilla.productos.forEach(element => {
				let productoParam: ProductoCarrito = productosMapeados.find(item => {
					return item.id === element.idProducto;
				});
				if (productoParam) {
					const listaVenta = listasVentaArray.find(item => {
						return item.id === element.listaVenta;
					});
					if (listaVenta) {
						productoParam.listaVenta = listaVenta;
						this.addProductoCarrito(productoParam, element.unidades);
					} else {
						count++;
					}
				} else {
					count++;
				}
			});

			if (count == 1) {
				mensaje = 'Un producto no se encuentra disponible';
				this.mostrarInfoDialog(mensaje);
			} else if (count > 1) {
				mensaje = count + ' productos no se encuentran disponibles.';
				this.mostrarInfoDialog(mensaje);
			}
		});
	}

	mostrarInfoDialog(mensaje) {
		const dialogRef = this.dialog.open(InfoDialogComponent, {
			width: '400px',
			height: '400px',
			data: { mensaje: mensaje, titulo: 'Productos no encontrados' }
		});
	}

	/**
	 * Método auxiliar para establecer que debe ser mostrado u ocultado el Loader en el Componente
	 * Debe pasarse el nombre de la Tarea que está pidiendo que se muestre/oculte el Loader.
	 * Toda tarea que llame al método para mostrar el Loader debe asegurarse de hacer el llamado correspondiente para
	 * ocultarlo
	 *
	 * @private
	 * @param {string} tarea
	 * @param {boolean} mostrar
	 * @memberof ProductosComponent
	 */
	private mostrarLoader(tarea: string, mostrar: boolean) {
		if (isNaN(this.tareasOcupadas[tarea])) this.tareasOcupadas[tarea] = 0;
		this.tareasOcupadas[tarea] = mostrar ? ++this.tareasOcupadas[tarea] : --this.tareasOcupadas[tarea];
		if (this.tareasOcupadas[tarea] < 0) {
			this.tareasOcupadas[tarea] = 0;
		}
		let existeTarea = false;
		for (const item of Object.values(this.tareasOcupadas)) {
			existeTarea = existeTarea || (item as number) > 0;
		}
		this.mostrarIndicadorCargando = existeTarea;
		this.ref.markForCheck();
	}

	/**
	 * Método para subscribir el Componente a las emisiones de nuevas Listas de Venta.
	 * Debe ser invocado solo una vez en el ciclo de vida del Componente
	 */
	subscripcionListaVentas() {
		this.actualizarListaVenta$
			.takeUntil(this.componenteDestruido$)
			.filter(e => e)
			.debounceTime(1000)
			.switchMap(e => this.route.params)
			.pipe(tap(e => this.mostrarLoader('listasVentas', true)))
			.switchMap(_ => this.listaVentaService.getFromProviderPedido(_['proveedor']))
			.subscribe(
				_ => {
					this.listaVenta = null;
					let listas: ListaDeVenta[] = [];
					listas = _.data;
					/*_.data.forEach(element => {
						let listaVentaItem = new ListaDeVenta(element[1], 'desc', [], [], []);
						listaVentaItem.setId(element[0]);
						listas.push(listaVentaItem);
					});*/
					//let listas = _.data as ListaDeVenta[];
					// Solo debemos utilizar Listas de Ventas con una Ubicación (GLN) Asociada
					// listas = listas.filter(e => e['ubicacion'] !== null && e['ubicacion'] !== undefined);
					this.listasVenta.next(listas);
					if (listas.length > 0) {
						this.listaVenta = listas[0];
					}
					this.actualizarProductos();
					this.mostrarLoader('listasVentas', false);
				},
				error => {
					this.mostrarLoader('listasVentas', false);
				}
			);
	}

	/**
	 * Método para subscribir el Componente a las emisiones de nuevos Productos.
	 * Debe ser invocado solo una vez en el ciclo de vida del Componente
	 */
	subscripcionProductos() {
		this.productos$.takeUntil(this.componenteDestruido$).subscribe((productos: Producto[]) => {
			this.productosSinGrupos = productos;
			this.actualizarPlantilla();
			this.actualizarFiltros(productos);
			this.productosDataSource.data = this.addGroups(productos, this.groupByColumns);
			this.productosDataSource.paginator = this.productosPaginator;
			this.productosDataSource.paginator._intl.itemsPerPageLabel = 'Por página';
			this.productosDataSource.paginator._intl.getRangeLabel = (page, size, length) =>
				`${page * size + 1} a ${page * size + size > length ? length : page * size + size} de ${length}`;
			productos.forEach(producto => {
				const productoCarrito = this.carrito.find(
					ev => ev.cpp === producto.cpp && ev.gtin === producto.gtin && ev.id === producto.id
				);
				producto.cantidad = productoCarrito ? productoCarrito.cantidad : 0;
			});
		});
	}

	subscripcionesVarias() {
		this.carritoService
			.getCarrito()
			.takeUntil(this.componenteDestruido$)
			.subscribe(carrito => {
				const productosTable = this.productosDataSource.data;
				this.carrito = carrito;
				productosTable.forEach(producto => {
					if (producto instanceof Group) return;
					const productoCarrito = this.carrito.find(
						ev =>
							ev.cpp === (producto as Producto).cpp &&
							ev.gtin === (producto as Producto).gtin &&
							ev.id === (producto as Producto).id
					);
					(producto as Producto).cantidad = productoCarrito ? productoCarrito.cantidad : 0;
				});
			});
		this.proveedoresService
			.getProveedores()
			.takeUntil(this.componenteDestruido$)
			.subscribe(itemProv => this.proveedores.next(itemProv));
	}

	/**
	 * Método que permite agregar Productos para realizar la OC
	 *
	 * @param {ProductoCarrito} productoParam
	 * @param {Event} event
	 * @returns
	 * @memberof ProductosComponent
	 */
	addProducto(productoParam: ProductoCarrito, event) {
		// actualizar la orden api TODO
		let actualizar = {
			unidades: event.target.value !== '' ? event.target.value : 0,
			gln: productoParam.gtin,
			cpp: productoParam.cpp,
			idProducto: productoParam.id,
			listaVenta: this.listaVenta.id
		};

		this.ordenesService.actualizarUltimaPlantilla(this.plantilla.id, actualizar).subscribe(response => {});

		const cantidadParam = event.target.value;
		const cantNumerica = parseInt(cantidadParam + '', 10) ? parseInt(cantidadParam + '', 10) : 0;
		event.target.value = cantNumerica;
		productoParam.cantidad = cantNumerica;
		let obs = this.obsCant$[productoParam.gtin + '' + productoParam.cpp];
		if (!obs) {
			obs = new Subject<{ producto: ProductoCarrito; cantidad: number }>();
			this.obsCant$[productoParam.gtin + '' + productoParam.cpp] = obs;
			obs.asObservable()
				.takeUntil(this.componenteDestruido$)
				.debounceTime(500)
				.subscribe(({ producto, cantidad }) => {
					producto.cantidad = cantidad;
					if (cantidad <= 0) {
						producto.cantidad = 0;
						this.carritoService.remove(producto.cpp, producto.gtin);
						return;
					}

					producto.listaVenta = this.listaVenta;
					// Esto se realiza previendo que se hagan OC a gtin de empaque distintos
					// al gtin que vienen en el campo gtin Producto
					producto.gtinOC = producto.gtin;
					//producto.moneda = this.moneda;
					this.carritoService.addToCarrito(producto);
				});
		}
		this.obsCant$[productoParam.gtin + '' + productoParam.cpp].next({
			producto: productoParam,
			cantidad: cantNumerica
		});
	}

	eliminarProducto(producto) {
		let actualizar = {
			unidades: 0,
			gln: producto.gtin,
			cpp: producto.cpp,
			idProducto: producto.id,
			listaVenta: producto.listaVenta.id
		};
		this.ordenesService.actualizarUltimaPlantilla(this.plantilla.id, actualizar).subscribe(response => {});
	}

	addProductoCarrito(productoParam: ProductoCarrito, cantidad) {
		const cantidadParam = cantidad;
		const cantNumerica = parseInt(cantidadParam + '', 10) ? parseInt(cantidadParam + '', 10) : 0;
		productoParam.cantidad = cantNumerica;
		let obs = this.obsCant$[productoParam.gtin + '' + productoParam.cpp];
		if (!obs) {
			obs = new Subject<{ producto: ProductoCarrito; cantidad: number }>();
			this.obsCant$[productoParam.gtin + '' + productoParam.cpp] = obs;
			obs.asObservable()
				.takeUntil(this.componenteDestruido$)
				.debounceTime(500)
				.subscribe(({ producto, cantidad }) => {
					producto.cantidad = cantidad;
					if (cantidad <= 0) {
						producto.cantidad = 0;
						this.carritoService.remove(producto.cpp, producto.gtin);
						return;
					}

					producto.listaVenta = this.listaVenta;
					// Esto se realiza previendo que se hagan OC a gtin de empaque distintos
					// al gtin que vienen en el campo gtin Producto
					producto.gtinOC = producto.gtin;
					//producto.moneda = this.moneda;
					this.carritoService.addToCarrito(producto);
				});
		}
		this.obsCant$[productoParam.gtin + '' + productoParam.cpp].next({
			producto: productoParam,
			cantidad: cantNumerica
		});
	}

	checkFiltro(filtro: Filtro) {
		if (!filtro.checked) {
			this.borrarFiltro(Utils.normalizarStr(filtro.nombre));
		} else {
			this.filtrosActivos = [...this.filtrosActivos, filtro.nombre];
		}
	}

	addFiltro(event: MatChipInputEvent): void {
		const value = event.value;

		if (!value) return;

		this.filtrosActivos = [...this.filtrosActivos, value.trim()];
		event.input.value = '';
		this.productosDataSource.filter = this.filtrosActivos.join('|');
		this.updateBadge();
	}

	updateBadge() {
		// Creo dos stacks para guardar Grupos y Cantidades de Elementos
		const gruposStack: Group[] = [];
		const cantidadFilasGrupoStack: number[] = [];
		// Recorro Productos Filtrados
		for (let index = 0; index < this.productosDataSource.filteredData.length; index++) {
			const element = this.productosDataSource.filteredData[index];
			if (element instanceof Group) {
				// Si ya tengo elementos debo ver que debo hacer si no simplemente agrego los Grupos al Stack
				if (gruposStack.length > 0) {
					// Si el Grupo a procesar es ancestro del actual debo actualizar todos los Grupos
					// hermanos al último en el stack y totalizarlos al anterior al nivel al que pertenecen
					if (element.level < gruposStack[gruposStack.length - 1].level) {
						let cant = 0;

						while (gruposStack.length > 0 && element.level < gruposStack[gruposStack.length - 1].level) {
							const grupo = gruposStack.pop();
							grupo.totalCounts = cantidadFilasGrupoStack.pop();
							cant += grupo.totalCounts;
						}
						cantidadFilasGrupoStack[cantidadFilasGrupoStack.length - 1] =
							cantidadFilasGrupoStack[cantidadFilasGrupoStack.length - 1] + cant;
					}
				}
				gruposStack.push(element);
				cantidadFilasGrupoStack.push(0);
				continue;
			}
			cantidadFilasGrupoStack[cantidadFilasGrupoStack.length - 1]++;
		}

		// Recorro y actualizo todos los que hayan quedado por estar a un mismo primer nivel
		let cantTotalPorAgrupacion = 0;
		let level = -1;
		while (gruposStack.length > 0) {
			const grupoFinalista = gruposStack.pop();
			grupoFinalista.totalCounts = cantidadFilasGrupoStack.pop();
			if (level === -1) {
				level = grupoFinalista.level;
				cantTotalPorAgrupacion = grupoFinalista.totalCounts;
				continue;
			}
			cantTotalPorAgrupacion += grupoFinalista.totalCounts;
			if (grupoFinalista.level !== level) {
				grupoFinalista.totalCounts = cantTotalPorAgrupacion;
				level = grupoFinalista.level;
			}
		}
	}

	borrarFiltro(nombreFiltro: string) {
		this.tiposFiltros.forEach(tipo => {
			const filtro = tipo.filtros.find(item => item.nombre.toLowerCase() === nombreFiltro.toLowerCase());
			if (filtro) filtro.checked = false;
		});

		this.filtrosActivos = this.filtrosActivos.filter(filtro => filtro !== nombreFiltro);
		let otros = [...this.selectedLineas, ...this.selectedMarcas];
		if (this.filtrosActivos.length > 0) {
			this.productosDataSource.filter = this.filtrosActivos.join('|');
		} else {
			this.productosDataSource.filter = otros.join('|');
		}
		this.updateBadge();
	}

	productosFilterPredicate = (data: Producto | Group, filter: string): boolean => {
		if (data instanceof Group) {
			return true;
		}
		filter = this.filtrosActivos.join('|');

		if (this.selectedLineas.length > 0) {
			let flag = false;
			this.selectedLineas.forEach(element => {
				if (element === data.linea) {
					flag = true;
				}
			});
			if (!flag) {
				return false;
			}
		}

		if (this.selectedMarcas.length > 0) {
			let flag = false;
			this.selectedMarcas.forEach(element => {
				if (element === data.marca) {
					flag = true;
				}
			});
			if (!flag) {
				return false;
			}
		}

		/*if (this.selectedDivisiones.length > 0) {
			let flag = false;
			this.selectedDivisiones.forEach(element => {
				if (element === data.division) {
					flag = true;
				}
			});
			if (!flag) {
				return false;
			}
    }*/

		const texto = data.descripcion + data.marca + data.division + data.linea + data.cpp + data.gtin;
		const busqueda = Utils.normalizarStr(texto);

		let filaVisible = false; //filter.split('|').every(filtro => busqueda.toLowerCase().includes(filtro.toLowerCase()));

		let filtros = filter.split('|');

		var counter = 0;
		filtros.forEach(element => {
			if (busqueda.indexOf(element.toLowerCase()) == -1) {
				counter += 1;
			}
		});

		var cantFilters = this.filtros.length;
		if (counter === 0 || filter === '') {
			filaVisible = true;
		} else {
			filaVisible = false;
		}

		const parentGroup: Group = data['parent'];
		if (filaVisible) {
			if (parentGroup) {
				parentGroup.visible = true;
			}
		}

		return filaVisible;
	};

	public actualizarProductos(): void {
		this.actualizarProductos$.next(true);
	}

	set filtrosActivos(value) {
		value = value.map(Utils.normalizarStr);
		// TODO Revisar esta implementacion para ver si va a ser necesaria para aplicar los filtros
		this.productosDataSource.filter = value.join('|');
		this.updateBadge();
		this._filtrosActivos.next(value);
	}

	get filtrosActivos() {
		return this._filtrosActivos.value;
	}

	get moneda() {
		return this._moneda;
	}
	set moneda(value) {
		this._moneda = value;
	}

	private actualizarFiltros(productos: Producto[]): void {
		const filtrosLinea: Filtro[] = [];
		const filtrosMarca: Filtro[] = [];
		const filtrosDivision: Filtro[] = [];
		const marcas = {};
		const lineas = {};
		const noSeUsa = {};
		const divisiones = {};

		productos.forEach(element => {
			if (element.marca !== null && element.marca !== undefined)
				marcas[element.marca.toUpperCase()] = element.marca;
			if (element.linea !== null && element.linea !== undefined)
				lineas[element.linea.toUpperCase()] = element.linea;
			if (element.division !== null && element.division !== undefined)
				noSeUsa[element.division.toUpperCase()] = element.division;
		});

		Object.values(marcas).forEach(marca => {
			const filtro = new Filtro();
			filtro.nombre = marca as string;
			filtro.checked = false;
			filtrosMarca.push(filtro);
		});
		Object.values(lineas).forEach(linea => {
			const filtro = new Filtro();
			filtro.nombre = linea as string;
			filtro.checked = false;
			filtrosLinea.push(filtro);
		});
		Object.values(divisiones).forEach(division => {
			const filtro = new Filtro();
			filtro.nombre = division as string;
			filtro.checked = false;
			filtrosDivision.push(filtro);
		});

		const listaTipoFiltro: TipoFiltro[] = [];
		listaTipoFiltro.push({
			nombre: 'Línea/familia',
			filtros: filtrosLinea,
			collapsed: true
		});
		listaTipoFiltro.push({
			nombre: 'Marca',
			filtros: filtrosMarca,
			collapsed: true
		});
		listaTipoFiltro.push({
			nombre: 'División',
			filtros: filtrosDivision,
			collapsed: true
		});
		this.tiposFiltros = listaTipoFiltro;
	}

	/**
	 * Realiza la solicitud de actualización de las Listas de Ventas
	 * Todos los Subscriptores del BehaviorSubject listasVenta serán notificados cuando se
	 * obtenga el resultado del Servidor con las nuevas Listas de Ventas
	 *
	 * @memberof ProductosComponent
	 */
	public refrescarListasDeVentas(): void {
		this.actualizarListaVenta$.next(true);
	}

	/**
	 * Devuelve verdadero si existe al menos un elemento para mostrar en las opciones para Filtrar
	 *
	 * @param {TipoFiltro[]} tipoFiltros
	 * @returns {boolean}
	 * @memberof ProductosComponent
	 */
	public existenFiltrosDisponibles(tipoFiltros: TipoFiltro[]): boolean {
		let filtroActivo = false;
		tipoFiltros.forEach(element => {
			filtroActivo = filtroActivo || element.filtros.length > 0;
		});
		return filtroActivo;
	}

	public goTo(route) {
		this.router.navigate(route);
	}

	groupBy(event, column) {
		event.stopPropagation();
		this.checkGroupByColumn(column.field, true);
		this.productosDataSource.data = this.addGroups(
			this.sortDataForGroupByColumn(this.productosSinGrupos),
			this.groupByColumns
		);
		this.updateBadge();
	}

	groupByForSort() {
		this.productosDataSource.data = this.addGroups(
			this.sortDataForGroupByColumn(this.productosSinGrupos),
			this.groupByColumns
		);
		this.updateBadge();
	}

	sortDataForGroupByColumn(productosSinGrupos: Producto[]): Producto[] {
		if (this.sortDataForGroup.active && this.sortDataForGroup.direction !== '') {
			const sorted = productosSinGrupos.sort((a: Producto, b: Producto) => {
				const isAsc = this.sortDataForGroup.direction === 'asc';
				switch (this.sortDataForGroup.active) {
					case 'marca':
						return this.compare(a.marca, b.marca, isAsc);
					case 'linea':
						return this.compare(+a.linea, +b.linea, isAsc);
					case 'descripcion':
						return this.compare(a.descripcion, b.descripcion, isAsc);
					case 'contenido':
						const unidadA = a.unidadMedida.toUpperCase();
						const unidadB = b.unidadMedida.toUpperCase();
						const medidasPeso = ['GR', 'KG', 'LB'];
						const medidasVolumen = ['ML', 'LT', 'CC', 'M3'];
						if (
							(medidasPeso.indexOf(unidadA) > -1 && medidasVolumen.indexOf(unidadB) > -1) ||
							(medidasPeso.indexOf(unidadB) > -1 && medidasVolumen.indexOf(unidadA) > -1)
						)
							return 0;
						return this.compare(
							+a.contenidoNeto * this.conversionFactor(a.contenidoNeto, a.unidadMedida),
							+b.contenidoNeto * this.conversionFactor(b.contenidoNeto, b.unidadMedida),
							isAsc
						);
					case 'precio':
						return this.compare(+a.precio, +b.precio, isAsc);
					default:
						return 0;
				}
			});
			return sorted;
		}
		return productosSinGrupos;
	}

	checkGroupByColumn(field, add) {
		let found = null;
		for (const column of this.groupByColumns) {
			if (column === field) {
				found = this.groupByColumns.indexOf(column, 0);
			}
		}
		if (found != null && found >= 0) {
			if (!add) {
				this.groupByColumns.splice(found, 1);
			}
		} else {
			if (add) {
				this.groupByColumns.push(field);
			}
		}
	}

	unGroupBy(event, column) {
		event.stopPropagation();
		this.checkGroupByColumn(column.field, false);
		this.productosDataSource.data = this.addGroups(this.productosSinGrupos, this.groupByColumns);
		this.updateBadge();
	}

	// below is for grid row grouping
	customFilterPredicate(data: Producto | Group, filter: string): boolean {
		return this.getDataRowVisible(data, filter);
	}

	getDataRowVisible(data: Producto | Group, filter: string): boolean {
		const groupRows = this.productosDataSource.data.filter(row => {
			if (!(row instanceof Group)) {
				return false;
			}
			let match = true;
			this.groupByColumns.forEach(column => {
				if (!row[column] || !data[column] || row[column] !== data[column]) {
					match = false;
				}
			});
			return match;
		});

		if (groupRows.length === 0) {
			return true;
		}
		const parent = groupRows[0] as Group;
		return (
			(filter.trim() !== '' || (!parent || (parent.visible && parent.expanded))) &&
			this.productosFilterPredicate(data, filter)
		);
	}

	groupIsCollapsed(division: string) {
		return (
			this.collapsedGroups.findIndex(item => {
				return item === division;
			}) > -1
		);
	}

	removeGroupFromCollapsed(division: string) {
		this.collapsedGroups = this.collapsedGroups.filter(item => {
			return item !== division;
		});
	}

	groupIsMarcaLineaCollapsed(row: Group) {
		if (row.marca !== undefined && row.linea === undefined) {
			return (
				this.collapsedMarcaLinea.findIndex(item => {
					return item.marca === row.marca && item.division === row.division;
				}) > -1
			);
		} else if (row.marca !== undefined && row.linea !== undefined) {
			return (
				this.collapsedMarcaLinea.findIndex(item => {
					return item.linea === row.linea && item.division === row.division;
				}) > -1
			);
		}
	}

	removeFromMarcaLineaCollapsed(row: Group) {
		if (row.marca !== undefined && row.linea === undefined) {
			this.collapsedMarcaLinea = this.collapsedMarcaLinea.filter(item => {
				return item.marca !== row.marca || item.division !== row.division;
			});
		} else if (row.marca !== undefined && row.linea !== undefined) {
			this.collapsedMarcaLinea = this.collapsedMarcaLinea.filter(item => {
				return item.linea !== row.linea || item.division !== row.division;
			});
		}
	}

	groupIsMarcaLineaCollapsedProduct(row: Group): boolean {
		if (this.collapsedMarcaLinea.length === 0) return false;
		let isCollapsed: boolean = false;
		this.collapsedMarcaLinea.forEach(element => {
			if (!isCollapsed) {
				if (element.marca !== undefined && element.linea === undefined) {
					isCollapsed = element.marca === row.marca && element.division === row.division;
				} else if (element.marca !== undefined && element.linea !== undefined) {
					isCollapsed =
						element.marca === row.marca && element.linea === row.linea && element.division === row.division;
				}
			}
		});
		return isCollapsed;
	}

	removeAllFromDivisionLineaMarca(row: Group) {
		if (
			this.collapsedMarcaLinea.findIndex(item => {
				return item.division === row.division;
			}) > -1
		) {
			this.collapsedMarcaLinea = this.collapsedMarcaLinea.filter(item => {
				return item.division !== row.division;
			});
		}
	}

	groupHeaderClick(event, row) {
		let expanded = row.expanded;
		if (row.level > 1) {
			if (row.marca !== undefined || row.linea !== undefined) {
				if (row.expanded) {
					if (!this.groupIsMarcaLineaCollapsed(row)) {
						this.collapsedMarcaLinea.push(row);
					}
				} else {
					if (this.groupIsMarcaLineaCollapsed(row)) {
						this.removeFromMarcaLineaCollapsed(row);
					}
				}
			}
			console.log(this.collapsedMarcaLinea);
		}

		if (row.level === 1) {
			if (this.groupIsCollapsed(row.division)) {
				this.removeGroupFromCollapsed(row.division);
			} else {
				this.removeAllFromDivisionLineaMarca(row);
				this.collapsedGroups.push(row.division);
			}
		}

		let productos = this.addGroups(this.productosSinGrupos, this.groupByColumns);
		this.productosDataSource.data = productos.filter(item => {
			if (item instanceof Group) {
				return true;
			} else {
				return !this.groupIsCollapsed(item.division) && !this.groupIsMarcaLineaCollapsedProduct(item);
			}
		});

		if (row.level === 1) {
			this.productosDataSource.data.forEach(item => {
				if (item instanceof Group) {
					if (item.division === row.division) {
						item.expanded = !row.expanded;
					} else {
						if (this.groupIsCollapsed(item.division) || this.groupIsMarcaLineaCollapsedProduct(item)) {
							item.expanded = false;
						} else {
							item.expanded = true;
						}
					}
				}
			});
		} else {
			this.productosDataSource.data.forEach(item => {
				if (item instanceof Group) {
					if (this.groupIsCollapsed(item.division) || this.groupIsMarcaLineaCollapsedProduct(item)) {
						item.expanded = false;
					} else {
						item.expanded = true;
					}
				}
			});
		}

		event.stopPropagation();
		row.expanded = !row.expanded;
	}

	addGroups(data: any[], groupByColumns: string[]): any[] {
		const rootGroup = new Group();
		rootGroup.expanded = true;
		const result = this.getSublevel(data, 0, groupByColumns, rootGroup);
		result.filter(element => {
			if (!(element instanceof Group)) return true;
			const group = element as Group;
			if (!group.totalCounts || group.totalCounts === 0) return false;
			return true;
		});
		return result;
	}

	getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
		if (level >= groupByColumns.length) {
			return data;
		}
		const groups = this.uniqueBy(
			data.map(row => {
				const result = new Group();
				result.level = level + 1;
				result.parent = parent;
				for (let i = 0; i <= level; i++) {
					result[groupByColumns[i]] = row[groupByColumns[i]];
				}
				return result;
			}),
			JSON.stringify
		);

		const currentColumn = groupByColumns[level];
		let subGroups = [];
		groups.forEach(group => {
			const rowsInGroup = [];
			data.forEach(row => {
				if (group[currentColumn] === row[currentColumn]) {
					row.parent = group;
					rowsInGroup.push(row);
				}
			});
			group.totalCounts = rowsInGroup.length;
			const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
			subGroup.unshift(group);
			subGroups = subGroups.concat(subGroup);
		});
		return subGroups;
	}

	uniqueBy(a, key) {
		const seen = {};
		return a.filter(item => {
			const k = key(item);
			const result = seen.hasOwnProperty(k) ? false : (seen[k] = true);
			return result;
		});
	}

	isGroup(index: any, item): boolean {
		return item instanceof Group;
	}

	public toggleColumnVissibility(field: IField) {
		field.visible = !field.visible;
	}

	/**
	 * Método llamado cuando se precisa realizar un ordenamiento en el DataTable por una de las columnas.
	 *
	 * @private
	 * @param {Sort} sort
	 * @returns
	 * @memberof ProductosComponent
	 */
	public sortData(dataSource: (Producto | Group)[], sort: MatSort): (Producto | Group)[] {
		this.sortDataForGroup = {
			active: sort.active,
			direction: sort.direction
		};
		if (
			this.groupByColumns.findIndex(item => {
				return item === this.sortDataForGroup.active;
			}) > -1
		) {
			if (this.sortDirection !== this.sortDataForGroup.direction) {
				this.sortDirection = this.sortDataForGroup.direction;
				this.groupByForSort();
			}
		}
		let orderedData = dataSource.slice();
		if (sort.active && sort.direction !== '') {
			let posIni = null;

			for (let i = 0; i < dataSource.length; i++) {
				// Si es un Grupo verfifico si debo ordenar el subset anterior
				// Para esto tomo como indicador si registré ya un inicio de rango de filas de Productos
				if (dataSource[i] instanceof Group) {
					if (posIni) {
						orderedData = this.partialSort(orderedData, posIni, i - 1, sort);
						posIni = null;
					}
					continue;
				}

				if (!posIni) posIni = i;
				if (dataSource.length - 1 === i && posIni)
					orderedData = this.partialSort(orderedData, posIni, i - 1, sort);
			}
		}

		return orderedData;
	}

	private partialSort(arr: (Producto | Group)[], start, end, sort: Sort) {
		const preSorted = arr.slice(0, start),
			postSorted = arr.slice(end);
		const sorted = arr.slice(start, end).sort((a: Producto, b: Producto) => {
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'marca':
					return this.compare(a.marca, b.marca, isAsc);
				case 'linea':
					return this.compare(+a.linea, +b.linea, isAsc);
				case 'descripcion':
					return this.compare(a.descripcion, b.descripcion, isAsc);
				case 'contenido':
					const unidadA = a.unidadMedida.toUpperCase();
					const unidadB = b.unidadMedida.toUpperCase();
					const medidasPeso = ['GR', 'KG', 'LB'];
					const medidasVolumen = ['ML', 'LT', 'CC', 'M3'];
					if (
						(medidasPeso.indexOf(unidadA) > -1 && medidasVolumen.indexOf(unidadB) > -1) ||
						(medidasPeso.indexOf(unidadB) > -1 && medidasVolumen.indexOf(unidadA) > -1)
					)
						return 0;
					return this.compare(
						+a.contenidoNeto * this.conversionFactor(a.contenidoNeto, a.unidadMedida),
						+b.contenidoNeto * this.conversionFactor(b.contenidoNeto, b.unidadMedida),
						isAsc
					);
				case 'precio':
					return this.compare(+a.precio, +b.precio, isAsc);
				default:
					return 0;
			}
		});

		return preSorted.concat(sorted).concat(postSorted);
	}

	private conversionFactor(value: number, unit: string) {
		switch (unit.toUpperCase()) {
			case 'LB':
				return value * 1000;
			case 'KG':
				return value * 1000;
			case 'LT':
				return value * 1000;
			case 'CC':
				return value * 1000000;
		}
		return value;
	}

	private compare(a, b, isAsc) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	}

	/**
	 * Función para determinar si el Producto pasado por parámetros
	 * está en uno de los siguientes estados:
	 * - Suspendido: Tiene una Fecha Desde y una Hasta de Suspensión Producto
	 * - Discontinuado: Tiene solo una Fecha Desde de Suspensión del Producto
	 *
	 *
	 *
	 * @param {Producto} producto
	 * @param {Date} fecha
	 * @memberof ProductosComponent
	 * @returns any
	 */
	public estadoProducto(producto: Producto, fecha?: Date): any {
		// TODO Llevar esta función a un Pure PIPE
		// Usar memoize de ser posible para mejorar aún mas la performance

		//  No tienen ningún dato de suspensión
		if (!producto.suspendidoDesde && !producto.suspendidoHasta) {
			return { estado: 'Activo' };
		}
		const fechaActual = new Date();
		if (producto.suspendidoDesde) {
			// Se chequea que si está discontinuado
			if (!producto.suspendidoHasta) {
				if (producto.suspendidoDesde.getTime() <= fechaActual.getTime()) {
					// discontinuado
					return {
						estado: 'Discontinuado',
						icon: 'remove_circle'
					};
				}

				return { estado: 'Activo' };
			}
			if (
				producto.suspendidoDesde.getTime() <= fechaActual.getTime() &&
				producto.suspendidoHasta.getTime() >= fechaActual.getTime()
			) {
				// suspendido
				return {
					estado: 'Suspendido',
					icon: 'pause_circle_filled'
				};
			}
		}

		return { estado: 'Activo' };
	}

	public tooltipProducto(prod: Producto): string {
		// TODO Llevar esta función a un Pure PIPE
		// Usar memoize de ser posible para mejorar aún mas la performance
		let tooltip = 'Inserte Cantidad de Unidades';

		// Verificar si esta suspendido
		switch (this.estadoProducto(prod).estado) {
			case 'discontinuado':
				return 'Producto Discontinuado';
			case 'suspendido':
				return 'Producto Suspendido';
		}

		if (prod.esPromo) {
			tooltip = 'Artículo en Promoción.' + tooltip;
		}
		return tooltip;
	}

	checkFiltroMatSelect(event: MatOptionSelectionChange, option: string) {
		if (
			event.source.value === 'Sin Linea' ||
			event.source.value === 'Sin Division' ||
			event.source.value === 'Sin Marca'
		) {
			event.source.value = '';
		}
		switch (option) {
			case this.tiposFiltros[0].nombre:
				this.updateLineaFiltros(event.source.value);
				break;
			case this.tiposFiltros[1].nombre:
				this.updateMarcaFiltros(event.source.value);
				break;
			case this.tiposFiltros[2].nombre:
				this.updateDivisionFiltros(event.source.value);
				break;
			default:
				break;
		}
	}

	updateLineaFiltros(linea: string) {
		const index = this.selectedLineas.findIndex(item => {
			return item === linea;
		});
		index > -1
			? (this.selectedLineas = this.selectedLineas.filter(item => {
					return item !== linea;
			  }))
			: this.selectedLineas.push(linea);

		this.otrosFiltros = [...this.filtrosActivos, ...this.selectedLineas];

		this.productosDataSource.filter = this.otrosFiltros.join('|');
		this.updateBadge();
	}

	updateDivisionFiltros(division: string) {
		const index = this.selectedDivisiones.findIndex(item => {
			return item === division;
		});
		index > -1
			? (this.selectedDivisiones = this.selectedDivisiones.filter(item => {
					return item !== division;
			  }))
			: this.selectedDivisiones.push(division);

		this.otrosFiltros = [...this.filtrosActivos, ...this.selectedDivisiones];

		this.productosDataSource.filter = this.otrosFiltros.join('|');
		this.updateBadge();
	}

	updateMarcaFiltros(marca: string) {
		const index = this.selectedMarcas.findIndex(item => {
			return item === marca;
		});
		index > -1
			? (this.selectedMarcas = this.selectedMarcas.filter(item => {
					return item !== marca;
			  }))
			: this.selectedMarcas.push(marca);

		this.otrosFiltros = [...this.filtrosActivos, ...this.selectedMarcas];

		this.productosDataSource.filter = this.otrosFiltros.join('|');
		this.updateBadge();
	}

	cargarPlantilla(plantillaId) {
		this.ordenesService.clonarPlantilla(plantillaId).subscribe(response => {
			this.carritoService.empty();
			this.plantilla.productos = response.data.productos;
			this.actualizarPlantilla();
			this.carritoSidenav.open();
		});
	}

	guardarPlantilla(nombre) {
		this.ordenesService.nombrePlantilla = nombre;
		this.ordenesService.descripcionPlantilla = nombre;
		let nuevaPlantilla = {
			descripcion: nombre,
			nombre: nombre
		};
		this.ordenesService.crearNuevaPlantilla(nuevaPlantilla).subscribe(response => {
			this.plantillasComponent.obtenerPlantillas();
			this.mostrarPlantillas = true;
		});
	}

	vaciarPlantilla(event) {
		this.ordenesService.eliminarProductosPlantilla(this.plantilla.id).subscribe(response => {});
	}

	filtrarSuspendidos(event) {
		this.actualizarProductos();
	}

	filtrarDiscontinuados(event) {
		this.actualizarProductos();
	}

	ocultarProductosDiscontinuados(ocultar) {
		this.ocultarDiscontinuados = ocultar;
		if (ocultar) {
			this.suspendidos = false;
			this.discontinuados = false;
		}
		this.actualizarProductos();
	}

	ocultarProductosSuspendidos(ocultar) {
		this.ocultarSuspendidos = ocultar;
		if (ocultar) {
			this.suspendidos = false;
			this.discontinuados = false;
		}
		this.actualizarProductos();
	}

	isNew(producto) {
		if (!(producto instanceof Group)) console.log(producto);
	}

	dropListDropped(event: CdkDragDrop<IField[]>, index: number) {
		if (event) {
			moveItemInArray(this.columns, index, event.currentIndex);
		}
	}

	get productosDisplayedColumns() {
		return this.columns.filter(c => c.visible).map(c => c.field);
	}

	openLeyendaMobile() {
		let dialogData = new DialogData();
		dialogData.type = 'primary';
		dialogData.isSingleButton = true;
		dialogData.template = this.leyendaTemplate;

		this.dialogService.open(dialogData);
	}
}
