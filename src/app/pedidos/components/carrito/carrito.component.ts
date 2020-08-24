import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	ViewChild,
	ChangeDetectionStrategy,
	ChangeDetectorRef
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { CarritoService, OrdenesService } from 'app/pedidos/services';
import { ProductoCarrito } from 'app/pedidos/models';
import { state, style, transition, animate, trigger } from '@angular/animations';
import { ConfirmDialogParameterComponent } from '../../../shared/confirm-dialog/components/confirm-dialog-parameter/confirm-dialog-parameter.component';
import { DialogService } from 'app/services/dialog.service';
import { DialogData } from 'app/models/DialogData/DialogData';

const titleKey = 'Guardar Plantilla';

const deleteBtnKey = 'Guardar Plantilla';

const messageKey = 'Debe escribir un nombre para guardar esta plantilla';

@Component({
	selector: 'app-carrito',
	templateUrl: './carrito.component.html',
	styleUrls: ['./carrito.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('estadoCarrito', [
			state(
				'lleno',
				style({
					height: '0px',
					opacity: '0',
					overflow: 'hidden'
				})
			),
			state(
				'vacio',
				style({
					height: '*',
					opacity: '1'
				})
			),
			transition('lleno => vacio', animate('500ms ease-in')),
			transition('vacio => lleno', animate('500ms ease-out'))
		])
	]
})
export class CarritoComponent implements OnInit {
	private _monedasOrder = ['', 'USD', 'UYU'];

	private _monedas = {};

	@ViewChild('tabGroupProductos') tabProductos: MatTabGroup;

	@Output() carritoToggled = new EventEmitter();

	@Output() eliminarProductoEventEmitter = new EventEmitter();

	@Output() vaciarPlantillaEventEmitter = new EventEmitter();

	@Output() guardarPlantillaEventEmitter = new EventEmitter();

	modalRef: MatDialogRef<ConfirmDialogParameterComponent>;

	public carritoDataSource: MatTableDataSource<ProductoCarrito>;

	public carritoDisplayedColumns = ['borrar', 'descripcion', 'cantidad', 'unidades', 'importe'];

	constructor(
		private cd: ChangeDetectorRef,
		private carritoService: CarritoService,
		private ordenesService: OrdenesService,
		private dialog: MatDialog,
		private dialogService: DialogService
	) {
		this.monedasOrder.forEach(moneda => {
			this._monedas[moneda] = 0;
		});
		this.carritoDataSource = new MatTableDataSource();
		this.carritoDataSource.filterPredicate = (data: ProductoCarrito, moneda: string) => {
			return (
				moneda !== null &&
				moneda !== undefined &&
				'' + data.moneda.toUpperCase().trim() === moneda.toUpperCase().trim()
			);
		};
		this.carritoToggled.subscribe(e => {
			this.tabChanged(this.tabProductos.selectedIndex);
		});
	}

	ngOnInit() {
		this.tabChanged(0);
		this.carritoService.getCarrito().subscribe(carrito => {
			this.carritoDataSource.data = carrito;
			const cantidades = carrito.reduce(
				(prev, curr) => ((prev[curr.moneda] = ++prev[curr.moneda] || 1), prev),
				{}
			);
			this._monedas[''] = cantidades[''] || 0;
			this._monedas['USD'] = cantidades['USD'] || 0;
			this._monedas['UYU'] = cantidades['UYU'] || 0;
			this._monedas['USDTotal'] = this.subtotalMoneda('USD');
			this._monedas['UYUTotal'] = this.subtotalMoneda('UYU');
			this.cd.markForCheck();
		});
	}

	toggleCarrito(toggle) {
		this.carritoToggled.emit(toggle);
	}

	quitarProductoDelCarrito(producto) {
		let dialogData = new DialogData();
		dialogData.title = 'Eliminar producto del carrito';
		dialogData.content = '¿Seguro que desea eliminar producto del carrito?';
		dialogData.type = 'warn';
		dialogData.acceptButtonText = 'Eliminar';

		const dialogRef = this.dialogService.open(dialogData);
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.eliminarProductoEventEmitter.emit(producto);
				producto.cantidad = 0;
				this.carritoService.remove(producto.cpp, producto.gtin);
			}
		});
	}

	addProducto(producto, cantidad) {
		if (cantidad <= 0) {
			this.quitarProductoDelCarrito(producto);
			return;
		}

		this.carritoService.addToCarrito(producto);
	}

	guardarPlanilla() {
		this.modalRef = this.dialog.open(ConfirmDialogParameterComponent, {
			data: {
				titleKey: titleKey,
				okBtnKey: deleteBtnKey,
				messageKey: messageKey,
				messageParam: { param: {} }
			}
		});

		this.modalRef.afterClosed().subscribe(result => {
			if (result) {
				this.guardarPlantillaEventEmitter.emit(result);
			}
		});
	}

	subtotal(proveedor: number): number {
		const carrito = this.carritoDataSource.data.filter(producto => producto.proveedor === proveedor);
		return carrito
			.map(producto => producto.precio * producto.cantidad)
			.reduce((total, precio) => total + precio, 0);
	}

	subtotalMoneda(moneda: string): number {
		let carrito = this.carritoDataSource.data || [];
		carrito = carrito.filter(producto => producto.moneda === moneda);
		return carrito
			.map(producto => {
				return producto.precio * producto.cantidad;
			})
			.reduce((total, precio) => total + precio, 0);
	}

	openEmptyCartDialog() {
		let dialogData = new DialogData();
		dialogData.title = 'Vaciar carrito';
		dialogData.content = '¿Seguro que desea vaciar el carrito?';
		dialogData.type = 'warn';
		dialogData.acceptButtonText = 'Vaciar';

		const dialogRef = this.dialogService.open(dialogData);
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.vaciarCarrito();
				this.vaciarPlantilla();
			}
		});
	}

	vaciarPlantilla() {
		this.vaciarPlantillaEventEmitter.emit(true);
	}

	vaciarCarrito() {
		this.carritoService.empty();
	}
	esProveedor = (_, item) => item.esProveedor;
	total = () =>
		this.carritoDataSource.data
			.map(producto => producto.precio * producto.cantidad)
			.reduce((previous, current) => previous + current, 0);

	/**
	 *  Método llamado cuando se selecciona un nuevo Tab.
	 *  En este método se define cuál tipo de moneda se debe Mostrar en el Carrito.
	 *
	 * @memberof CarritoComponent
	 */
	tabChanged = (index: number) => {
		// Se agrega el espacio para poder manejar el BUG que no permite filtrar si el Predicado evalua como false
		// Issue: https://github.com/angular/components/issues/9967
		// Se debe hacer un trim() además en el FilterPredicate
		this.carritoDataSource.filter = this.monedasOrder[index] + ' ';
		this.cd.markForCheck();
	};

	get monedas() {
		return this._monedas;
	}
	set monedas(value) {
		this._monedas = value;
	}

	get monedasOrder() {
		return this._monedasOrder;
	}
	set monedasOrder(value) {
		this._monedasOrder = value;
	}
}
