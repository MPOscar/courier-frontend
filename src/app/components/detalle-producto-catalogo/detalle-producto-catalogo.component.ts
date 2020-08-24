import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { Producto, Empaque } from 'app/models';
import { Router } from '@angular/router';
import { CountryService } from 'app/services/country.service';
import { AppConfig } from 'app/app.config';

import { ProductosService } from '../../services';

@Component({
	selector: 'app-detalle-producto-catalogo',
	templateUrl: './detalle-producto-catalogo.component.html',
	styleUrls: ['./detalle-producto-catalogo.component.scss']
})
export class DetalleProductoCatalogoComponent implements OnInit, OnChanges {
	@Input() producto: Producto = null;
	@Input() catalogoOtros: boolean = false;

	@Output() goToProductDetailEventEmitter: EventEmitter<any> = new EventEmitter();
	@Output() addToWishlistEventEmitter: EventEmitter<any> = new EventEmitter();
	@Output() removeFromWishlistEventEmitter: EventEmitter<any> = new EventEmitter();
	panelGeneralAbierto: boolean = true;

	productId: number = 0;
	isProductInWishList: boolean = true;
	empaquesProductoDetalle: Empaque[];

	constructor(
		public countryService: CountryService,
		public productosService: ProductosService,
		private router: Router,
		public appConfig: AppConfig
	) {}

	ngOnInit() {}

	ngOnChanges() {
		if (this.producto && this.productId != this.producto.id) {
			this.productId = this.producto.id;
			this.isProductInWishList = this.productosService.isProductInWishList(this.producto.id.toString());
			this.cargarEmpaques(this.producto);
		}
	}
	goToProductDetail(productId) {
		if (this.producto != null && this.producto != undefined) {
			this.router.navigate(['/producto-detalle', productId]);
		}
	}

	goToProductDetailOtroCatalogo(productId) {
		this.goToProductDetailEventEmitter.emit(productId);
	}

	addToWishlist(productId) {
		this.addToWishlistEventEmitter.emit(productId);
		this.isProductInWishList = true;
	}

	removeFromWishlist(productId) {
		this.removeFromWishlistEventEmitter.emit(productId);
		this.isProductInWishList = false;
	}
	cargarEmpaques(product) {
		this.empaquesProductoDetalle = [];
		let tempPack = product.empaques[0];
		while (tempPack != null) {
			this.empaquesProductoDetalle.push(tempPack);
			tempPack = tempPack.padre;
		}
	}
}
