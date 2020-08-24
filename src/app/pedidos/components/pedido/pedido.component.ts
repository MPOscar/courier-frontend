import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	OnDestroy,
	Inject,
	ChangeDetectorRef,
	ViewChild,
	ElementRef
} from '@angular/core';
import { ProductoCarrito, Proveedor } from 'app/pedidos/models';
import { Plantilla } from 'app/pedidos/models/Orden/Plantilla';
import { CarritoService, ProveedoresService, OrdenesService } from 'app/pedidos/services';
import { SucursalService } from 'app/pedidos/services/sucursales.service';

import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogData } from 'app/models/DialogData/DialogData';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CrearOCConfirmacionDialogComponent, Estado } from './crear-oc-confirmacion-dialog.component';
import { Producto } from 'app/models';
interface Mensaje {
	tipo: string;
	mensaje: string;
}
@Component({
	selector: 'app-pedidos-oc-dialog',
	templateUrl: 'crear-oc-respuesta-dialog.html',
	styleUrls: ['crear-oc-respuesta-dialog.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrearOCRespuestaDialog {
	public mensajes: Mensaje[] = [];
	public titulo = '';
	constructor(
		public dialogRef: MatDialogRef<CrearOCRespuestaDialog>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData
	) {
		this.mensajes = data['mensajes'];
		this.titulo = data['titulo'];
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'app-pedido',
	templateUrl: 'pedido.component.html',
	styleUrls: ['pedido.component.scss']
})
export class PedidoComponent implements OnInit, OnDestroy {
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

	public minDate: Date = new Date();

	public carrito: ProductoCarrito[] = [];
	public proveedores: BehaviorSubject<Proveedor[]> = new BehaviorSubject<Proveedor[]>([]);
	public proveedoresEnCarrito: Proveedor[] = [];
	public comentario = '';
	public nroOrden = '';
	public fechaEntrega: FormControl;
	public mostrarIndicadorCargando = false;

	public productosDataSource: MatTableDataSource<ProductoCarrito>;
	public displayedColumns: string[] = ['proveedor', 'remove-product', 'description', 'cases', 'price', 'units'];

	plantilla: Plantilla;

	itemsInCart: Producto[] = [];

	listaVentaId: number;

	proveedorId: string;

	sucursales: Array<any> = [];

	sucursal: any = null;

	constructor(
		private carritoService: CarritoService,
		private proveedoresService: ProveedoresService,
		private ordenesService: OrdenesService,
		public dialog: MatDialog,
		private router: Router,
		private cd: ChangeDetectorRef,
		public sucursalService: SucursalService
	) {
		const fecha = new Date();
		fecha.setDate(fecha.getDate() + 1);
		this.fechaEntrega = new FormControl(fecha);
		this.productosDataSource = new MatTableDataSource<ProductoCarrito>([]);
	}

	ngOnDestroy(): void {
		this.componenteDestruido$.next();
		this.componenteDestruido$.complete();
	}

	ngOnInit() {
		this.mostrarIndicadorCargando = false;
		const proveedores$ = this.proveedoresService
			.updateProveedores()
			.takeUntil(this.componenteDestruido$)
			.subscribe(proveedores => {
				this.proveedores.next(proveedores);
				this.carrito.forEach(prod => {
					prod._proveedor = this.proveedores.getValue().find(proveedor => proveedor.id == prod.proveedor);
				});
				this.productosDataSource.data = this.carrito;
				this.cd.markForCheck();
			});
		const carrito$ = this.carritoService
			.getCarrito()
			.takeUntil(this.componenteDestruido$)
			.subscribe(carrito => {
				this.carrito = carrito;
				this.productosDataSource.data = this.carrito;
			});

		this.nroOrden = this.generarNroOrden(new Date());

		this.ordenesService.obtenerUltimaPlantilla().subscribe(response => {
			this.plantilla = response.data;
			this.ordenesService.plantillaId = this.plantilla.id;
			if (this.carrito.length === 0) {
				this.itemsInCart = JSON.parse(localStorage.getItem('itemsInCart'));
				this.itemsInCart.forEach(element => {
					this.carritoService.addToCarrito(element);
				});
				//localStorage.removeItem('itemsInCart');
			}
			this.proveedorId = localStorage.getItem('proveedorId');
			this.listaVentaId = this.carrito[0].listaVenta.id;
		});
		this.sucursalService.obtenerSucursales().subscribe(response => {
			const data: any = response;
			this.sucursales = data.data;
		});
	}

	private generarNroOrden(fecha: Date): string {
		let nro = '';
		nro = nro.concat(
			'' + fecha.getFullYear(),
			'' + fecha.getUTCMonth(),
			'' + fecha.getUTCDay(),
			'' + fecha.getHours(),
			'' + fecha.getMinutes(),
			'' + fecha.getUTCSeconds()
		);
		return nro;
	}

	carritoProveedor(proveedor: number): ProductoCarrito[] {
		return this.carrito.filter(prod => prod.proveedor == proveedor);
	}

	addProducto(producto, cantidad) {
		this.eliminarProducto(producto);
		if (cantidad === 0) {
			this.carritoService.remove(producto.cpp, producto.gtin);
		} else {
			this.carritoService.addToCarrito(producto);
		}
	}

	subtotal(proveedor: number): number {
		const carrito = this.carritoProveedor(proveedor);
		return carrito
			.map(producto => producto.precio * producto.cantidad)
			.reduce((previous, current) => previous + current);
	}

	actualizarCantidad(producto, event) {
		let actualizar = {
			unidades: parseInt(event.target.value),
			gln: producto.gtin,
			cpp: producto.cpp,
			idProducto: producto.id,
			listaVenta: producto.listaVenta.id
		};
		this.ordenesService.actualizarUltimaPlantilla(this.plantilla.id, actualizar).subscribe(response => {});
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

	regresar() {
		this.router.navigateByUrl('/pedidos/productos/' + this.proveedorId);
	}

	finalizarOc = () =>
		Observable.of(null)
			.switchMap(e => {
				const cantOrdenes = new Set<string>();
				this.carrito.forEach(producto => {
					cantOrdenes.add(producto.proveedor + '-' + producto.moneda);
				});
				let mensaje =
					'Se generará una Orden de Compra con Número: ' +
					(this.nroOrden && this.nroOrden.trim() != ''
						? this.nroOrden
						: 'No establecido, se autogenerará uno');
				if (cantOrdenes.size > 1) {
					mensaje =
						'Usted ha seleccionado más de un Proveedor y/o Moneda. En consecuencia se generarán ' +
						cantOrdenes.size +
						' Órdenes de compra con sus correspondientes números.';
				}
				const dialog = this.dialog.open(CrearOCConfirmacionDialogComponent, {
					width: '400px',
					height: '400px',
					data: {
						mensaje: mensaje,
						numeroOrden: this.nroOrden,
						titulo: 'Confirmación del Pedido'
					}
				});
				return dialog.afterClosed();
			})
			.filter((response: any) => {
				this.ordenesService.nombrePlantilla = response.nombre;
				this.ordenesService.descripcionPlantilla = response.descripcion;
				this.ordenesService.lugarDeEntrega = this.sucursal.gln;
				this.ordenesService.lugarDeEntregaDescripcion = this.sucursal.descripcion;
				return response.estado === Estado.Accept;
			})
			.do(e => {
				this.mostrarIndicadorCargando = true;
				this.cd.markForCheck();
			})
			.switchMap(e =>
				this.ordenesService.enviarOrden(
					this.comentario,
					this.nroOrden != null && this.nroOrden.trim() !== '' ? this.nroOrden : null,
					this.fechaEntrega.value,
					this.carrito
				)
			)
			.subscribe(
				success => {
					const dialogRef = this.dialog.open(CrearOCRespuestaDialog, {
						width: '400px',
						height: '400px',
						data: { mensajes: success, titulo: 'Órdenes Enviadas' }
					});
					this.comentario = '';
					const fecha = new Date();
					fecha.setDate(fecha.getDate() + 1);
					this.fechaEntrega = new FormControl(fecha);
					this.carritoService.empty();
					this.mostrarIndicadorCargando = false;
					this.cd.markForCheck();
					dialogRef.afterClosed().subscribe(
						_ => {
							this.router.navigate(['/pedidos/proveedores']);
						},
						error => {
							this.router.navigate(['/pedidos/proveedores']);
						}
					);
				},
				error => {
					const dialogRef = this.dialog.open(CrearOCRespuestaDialog, {
						width: '400px',
						height: '400px',
						data: {
							mensajes: ['Error Enviando Órdenes al Servidor. Por favor intente nuevamente'],
							titulo: 'Error Enviando Órdenes'
						}
					});
					this.mostrarIndicadorCargando = false;
					this.cd.markForCheck();
				}
			);

	total = (moneda: string) =>
		this.carrito
			.filter(producto =>
				moneda !== null
					? producto.moneda == moneda
					: producto.moneda == null || producto.moneda == undefined || producto.moneda.trim() == ''
			)
			.map(producto =>
				producto.moneda == null || producto.moneda == undefined || producto.moneda.trim() == ''
					? 1
					: producto.precio * producto.cantidad
			)
			.reduce((previous, current) => previous + current, 0);
}
