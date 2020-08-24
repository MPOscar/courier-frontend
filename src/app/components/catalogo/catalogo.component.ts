import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto, ProductoCatalogo } from '../../models';

@Component({
	selector: 'catalogo',
	templateUrl: './catalogo.component.html',
	styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
	productos: ProductoCatalogo[];
	productoDetalle: ProductoCatalogo;
	selectedFilters: BehaviorSubject<string[]> = new BehaviorSubject([]);
	catalogoOtros: boolean = false;

	constructor() {}

	ngOnInit() {}

	handleProductosChange(products: Producto[]) {
		this.productos = products;
	}

	handleProductoDetalleChange(product: Producto) {
		this.productoDetalle = product;
	}
}
