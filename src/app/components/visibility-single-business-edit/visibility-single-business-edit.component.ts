import { Component, OnInit } from '@angular/core';
import { Empresa, Producto } from 'app/models';
import { AlertService, CategoriasService, ProductosService } from 'app/services';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-visibility-single-business-edit',
	templateUrl: './visibility-single-business-edit.component.html',
	styleUrls: ['./visibility-single-business-edit.component.scss']
})
export class VisibilitySingleBusinessEditComponent implements OnInit {
	public products: Producto[] = [];
	private productsBuffer: Producto[] = [];
	public selectedProducts: Producto[] = [];
	private selectedProductsBuffer: Producto[] = [];
	private categoriesQuantity: number = 0;
	private productsQuantity: number = 0;
	private selectedProductsQuantity: number = 0;
	private categoriesSelectedQuantity: number = 0;
	private productSubscription: Subscription;
	private selectedProductSubscription: Subscription;
	private categorySubscription: Subscription;
	private categorySelectedSubscription: Subscription;
	public business: Empresa;

	constructor(
		private categoryService: CategoriasService,
		public productosService: ProductosService,
		private alertService: AlertService
	) {}

	ngOnInit() {
		this.business = this.productosService.businessForVisibility;
		this.cargarProductosEdit();
		this.cargarProductos();
	}

	ngOnDestroy() {
		if (this.productSubscription) {
			this.productSubscription.unsubscribe();
		}
		if (this.selectedProductSubscription) {
			this.selectedProductSubscription.unsubscribe();
		}
		if (this.categorySubscription) {
			this.categorySubscription.unsubscribe();
		}
		if (this.categorySelectedSubscription) {
			this.categorySelectedSubscription.unsubscribe();
		}
	}

	cargarProductos() {
		this.productSubscription = this.productosService.getProductos().subscribe(productos => {
			this.productsQuantity = productos.length;
			productos.forEach(product => {
				this.cargarCategoria(product);
			});
		});
	}

	cargarProductosEdit() {
		this.selectedProductSubscription = this.productosService
			.getVisible('' + this.business.id)
			.subscribe(productos => {
				this.selectedProductsQuantity = productos.data.length;
				productos.data.forEach(product => {
					this.cargarCategoriaSelectedProduct(product);
				});
			});
	}

	cargarCategoria(product) {
		if (typeof product.categoria == 'number') {
			this.categorySubscription = this.categoryService.getCategory(product.categoria).subscribe(res => {
				product.categoria = res.data;
			});
		}
		this.productsBuffer.push(product);
		this.categoriesQuantity++;
		if (this.categoriesQuantity === this.productsQuantity) {
			this.products = this.productsBuffer;
		}
	}

	cargarCategoriaSelectedProduct(product) {
		if (typeof product.categoria == 'number') {
			this.categorySelectedSubscription = this.categoryService.getCategory(product.categoria).subscribe(res => {
				product.categoria = res.data;
			});
		}
		this.selectedProductsBuffer.push(product);
		this.categoriesSelectedQuantity++;
		if (this.categoriesSelectedQuantity === this.selectedProductsQuantity) {
			this.selectedProducts = this.selectedProductsBuffer;
		}
	}

	public handleSelectedProductschange(products: Producto[]) {
		this.productosService.productsForMassiveVisibility = products;
		if (this.productosService.productsForMassiveVisibility.length > 0) {
			this.productosService.productsForMassiveVisibilityChosen = true;
		} else {
			this.productosService.productsForMassiveVisibilityChosen = false;
		}
	}

	createProductArrayOnlyIds(array: Producto[]): Array<Producto> {
		var ret = Array<Producto>();
		array.forEach(element => {
			var product = new Producto();
			product.id = element.id;
			ret.push(product);
		});
		return ret;
	}

	saveChanges() {
		try {
			if (this.productosService.productsForMassiveVisibilityChosen) {
				let products = this.createProductArrayOnlyIds(this.productosService.productsForMassiveVisibility);
				this.productosService.saveBusinessVisibility(this.business, products).subscribe(
					data => {
						this.productosService.editBusinessVisibility = false;
						this.alertService.success('Visibilidad editada.', 'OK');
					},
					error => {
						this.alertService.error('No se pudo guardar la visibilidad.', 'OK');
					}
				);
			} else {
				this.alertService.error('Debes agregar por lo menos un producto');
			}
		} catch (e) {
			this.alertService.error('Ocurrió un error.', 'OK');
		}
	}
}
