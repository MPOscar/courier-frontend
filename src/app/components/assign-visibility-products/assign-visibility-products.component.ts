import { Component, OnInit } from '@angular/core';
import { Producto } from 'app/models';
import { CategoriasService, ProductosService } from 'app/services';
import { Subscription } from 'rxjs';
@Component({
	selector: 'assign-visibility-products',
	templateUrl: './assign-visibility-products.component.html',
	styleUrls: ['./assign-visibility-products.component.scss']
})
export class AssignVisibilityProductsComponent implements OnInit {
	public products: Producto[] = [];
	public selectedProducts: Producto[] = [];
	private productSubscription: Subscription;
	private categorySubscription: Subscription;

	constructor(private categoryService: CategoriasService, private productosService: ProductosService) {}

	ngOnInit() {
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
		this.productSubscription = this.productosService.getProductos().subscribe(productos => {
			productos.forEach(product => {
				if (product.categoria && !product.categoria.nombre) {
					this.cargarCategoria(product);
				}
			});
			this.products = productos;
		});
	}

	public handleSelectedProductschange(products: Producto[]) {
		this.productosService.productsForMassiveVisibility = products;
		if (this.productosService.productsForMassiveVisibility.length > 0) {
			this.productosService.productsForMassiveVisibilityChosen = true;
		} else {
			this.productosService.productsForMassiveVisibilityChosen = false;
		}
	}
}
