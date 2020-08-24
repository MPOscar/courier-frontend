import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Producto } from 'app/models';
import { CategoriasService, ProductosService, SaleListService } from 'app/services';
import { Subscription } from 'rxjs';

@Component({
	selector: 'sale-list-products',
	templateUrl: './sale-list-products.component.html',
	styleUrls: ['./sale-list-products.component.scss']
})
export class SaleListProductsComponent implements OnInit, OnDestroy {
	@Input() isEditing: boolean = false;

	public products: Producto[] = [];
	public selectedProducts: Producto[] = [];
	private selectedProductsBuffer: Producto[] = [];
	private categoriesQuantity: number = 0;
	private productSubscription: Subscription;
	private categorySubscription: Subscription;

	constructor(
		private categoryService: CategoriasService,
		private saleListService: SaleListService,
		private productosService: ProductosService
	) {}

	ngOnInit() {
		if (this.isEditing) {
			this.cargarProductosEdit();
		}
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

	cargarProductosEdit() {
		this.saleListService.listToEdit.productos.forEach(product => {
			if (product.categoria && !product.categoria.nombre) {
				this.cargarCategoriaSelectedProduct(product);
			}
		});
	}

	cargarCategoriaSelectedProduct(product) {
		if (typeof product.categoria == 'number') {
			this.categorySubscription = this.categoryService.getCategory(product.categoria).subscribe(res => {
				product.categoria = res.data;
				this.selectedProductsBuffer.push(product);
				this.categoriesQuantity++;
				if (this.categoriesQuantity === this.saleListService.listToEdit.productos.length) {
					this.selectedProducts = this.selectedProductsBuffer;
				}
			});
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
			this.products = productos.filter(product => this.productIsVisible(product));
		});
	}

	private productIsVisible(product: Producto): boolean {
		return product.esPublico || product.esPrivado;
	}

	public handleSelectedProductschange(products: Producto[]) {
		this.saleListService.products = products;
		if (this.saleListService.products.length > 0) {
			this.saleListService.thirdStepDone = true;
		} else {
			this.saleListService.thirdStepDone = false;
		}
	}
}
