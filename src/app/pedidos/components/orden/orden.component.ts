import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Utils } from 'app/utils/Utils';
import { ProveedoresService, OrdenesService } from 'app/pedidos/services';
import { Orden, Proveedor, ProductoCarrito } from 'app/pedidos/models';

@Component({
	selector: 'app-orden',
	templateUrl: 'orden.component.html',
	styleUrls: ['orden.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdenComponent implements OnInit {
	public numeroOrden: number;
	public orden: Orden;
	public productosProveedores: Object;

	public cargando: boolean = true;

	constructor(
		private route: ActivatedRoute,
		private proveedoresService: ProveedoresService,
		private orderService: OrdenesService
	) {}

	ngOnInit() {
		this.numeroOrden = this.route.snapshot.params.numero;
		this.orderService.getOrdenes().subscribe(ordenes => this.cargarOrdenes(ordenes));
	}

	cargarOrdenes(ordenes: Orden[]) {
		if (!ordenes.length) return;

		this.orden = ordenes.find(orden => orden.nroOrden === '' + this.numeroOrden);
		this.proveedoresService.getProveedores().subscribe(proveedores => this.loadProveedores(proveedores));
	}

	loadProveedores(proveedores: Proveedor[]) {
		this.orden.productosCarrito.forEach(
			producto => (producto._proveedor = proveedores.find(proveedor => proveedor.id == producto.proveedor))
		);
		this.productosProveedores = Utils.groupBy(this.orden.productosCarrito, 'proveedor', 'nombre');
		this.cargando = false;
	}

	subtotal(proveedor: number): number {
		let carrito = this.carritoProveedor(proveedor);
		return carrito.map(producto => producto.precio * producto.cantidad).reduce((total, precio) => total + precio);
	}

	carritoProveedor = (proveedor: number): ProductoCarrito[] =>
		this.orden.productosCarrito.filter(producto => producto.proveedor == proveedor);

	total = () =>
		this.orden.productosCarrito
			.map(producto => producto.precio * producto.cantidad * producto.nivelMinimoVenta)
			.reduce((previous, current) => previous + current);

	get productosProveedoresKeys() {
		return Object.keys(this.productosProveedores);
	}
}
