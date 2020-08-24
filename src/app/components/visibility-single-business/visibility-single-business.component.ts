import { Component, OnInit } from '@angular/core';
import { Producto, Empresa } from 'app/models';
import { CategoriasService, ProductosService, AlertService, AuthenticationService } from 'app/services';
import { Subscription } from 'rxjs';

@Component({
	selector: 'visibility-single-business',
	templateUrl: './visibility-single-business.component.html',
	styleUrls: ['./visibility-single-business.component.scss']
})
export class VisibilitySingleBusinessComponent implements OnInit {
	public selectedProducts: Producto[] = [];
	private productSubscription: Subscription;
	private categorySubscription: Subscription;
	public business: Empresa;

	constructor(private categoryService: CategoriasService, public productosService: ProductosService) {}

	ngOnInit() {
		this.business = this.productosService.businessForVisibility;
		this.cargarProductos();
	}

	ngOnDestroy() {
		if (this.productSubscription) {
			this.productSubscription.unsubscribe();
		}
		if (this.categorySubscription) {
			this.categorySubscription.unsubscribe();
		}
	}

	cargarCategoria(product) {
		if (typeof product.categoria == 'number') {
			this.categoryService.getCategory(product.categoria).subscribe(res => {
				product.categoria = res.data;
			});
		}
	}

	cargarProductos() {
		this.productSubscription = this.productosService.getVisible('' + this.business.id).subscribe(productos => {
			productos.data.forEach(product => {
				if (product.categoria && !product.categoria.nombre) {
					this.cargarCategoria(product);
				}
			});
			this.selectedProducts = productos.data;
		});
	}
}
