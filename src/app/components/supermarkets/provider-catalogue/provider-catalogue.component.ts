import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto, ProductoCatalogo } from '../../../models';
import { Router, ActivatedRoute } from '@angular/router';
import {
	ProductosService,
	AlertService,
	PresentacionesService,
	CategoriasService,
	EmpresasService
} from '../../../services';
@Component({
	selector: 'provider-catalogue',
	templateUrl: './provider-catalogue.component.html',
	styleUrls: ['./provider-catalogue.component.scss']
})
export class ProviderCatalogueComponent implements OnInit {
	productos: ProductoCatalogo[];
	productoDetalle: ProductoCatalogo;
	selectedFilters: BehaviorSubject<string[]> = new BehaviorSubject([]);

	providerId: number;
	catalogoOtros: boolean = true;

	constructor(
		private route: ActivatedRoute,
		private empresasService: EmpresasService,
		private productosService: ProductosService,
		private router: Router
	) {
		if (this.route.snapshot.params['id'] == '0') {
			this.providerId = 4;
		} else {
			this.providerId = this.route.snapshot.params['id'];
			localStorage.setItem('currentProviderId', this.providerId.toString());
			this.empresasService.currentProvider = this.providerId.toString();
		}
	}

	ngOnInit() {
		this.updateWishlist();
	}

	updateWishlist() {
		this.productosService.getWishlistFromProvider(this.providerId.toString()).subscribe(response => {
			this.productosService.wishlistFromProvider = [];
			response.data.forEach(product => {
				this.productosService.wishlistFromProvider.push(product.id.toString());
			});
		});
	}

	handleProductosChange(products: Producto[]) {
		this.productos = products;
	}

	handleProductoDetalleChange(product: Producto) {
		this.productoDetalle = product;
	}

	goToProductDetail(productId) {
		this.productosService.backArrowToCatalog = true;
		if (this.productoDetalle != null && this.productoDetalle != undefined) {
			this.router.navigate(['/cliente-producto-detalle', productId, this.providerId]);
		} else {
			//alert error
		}
	}

	addToWishlist(productId) {
		if (this.productoDetalle != null && this.productoDetalle != undefined) {
			this.productosService.addToWishlist(productId).subscribe(response => {
				this.productoDetalle.enWishlist = true;
				this.empresasService.addWishlistToProvider(this.providerId);
				this.updateWishlist();
			});
		}
	}

	removeFromWishlist(productId) {
		if (this.productoDetalle != null && this.productoDetalle != undefined) {
			this.productosService.removeFromWishlist(productId).subscribe(response => {
				this.productoDetalle.enWishlist = false;
				this.empresasService.removeWishlistFromProvider(this.providerId);
				this.updateWishlist();
			});
		}
	}
}
