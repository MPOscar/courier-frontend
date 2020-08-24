import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService, EmpresasService, TiendaInglesaExportService, CategoriasService } from '../../../services';
import { ExportService } from '../../../services/export.service';
import { Subscription } from 'rxjs';
import { Producto } from '../../../models';
import { AlertService } from '../../../services/index';
import { AppConfig } from 'app/app.config';

@Component({
	selector: 'provider-wishlist',
	templateUrl: './provider-wishlist.component.html',
	styleUrls: ['./provider-wishlist.component.scss']
})
export class ProviderWishlistComponent implements OnInit {
	providerId: number;
	productsSubscription: Subscription;
	provider: String;
	products: Producto[] = [];
	allProducts: Producto[] = [];
	allProductsLoaded = false;
	public isTata = false;
	selectedValue: string = 'Productos Seleccionados';
	dropdownSelectedValue: number = 0;

	dataSource: any[];
	productsArray: any[] = new Array<any>();
	isExtendedRow = (index, item) => item.extend;
	displayedColumns = ['imagen', 'cpp', 'descripcion', 'gtin', 'marca', 'linea', 'xx'];

	constructor(
		private tiendaInglesaExportService: TiendaInglesaExportService,
		private exportService: ExportService,
		private empresasService: EmpresasService,
		private route: ActivatedRoute,
		private router: Router,
		private productosService: ProductosService,
		private providerService: EmpresasService,
		private categoryService: CategoriasService,
		private alertService: AlertService,
		public appConfig: AppConfig
	) {
		this.providerId = this.route.snapshot.params['id'];
		this.provider = providerService.currentProviderName;
		this.productosService.getFromProvider('' + this.providerId).subscribe(productos => {
			this.allProducts = productos.data;
			this.allProductsLoaded = true;
		});
		var userString = localStorage.getItem('user');
		if (userString != null) {
			var user = JSON.parse(userString);
			if (user.id == 6) {
				this.isTata = true;
			}
		}
	}

	cargarCategoria(product) {
		if (typeof product.categoria == 'number') {
			this.categoryService.getCategory(product.categoria).subscribe(res => {
				product.categoria = res.data;
			});
		}
	}

	ngOnInit() {
		this.productsSubscription = this.productosService
			.getWishlistFromProvider('' + this.providerId)
			.subscribe(productos => {
				this.products = productos.data;
				this.products.forEach(product => {
					if (product.categoria.nombre == undefined) {
						this.cargarCategoria(product);
					}
				});
				this.products.sort(this.compareProductsByDiv);
				this.loadProductsArray();
			});
	}

	loadProductsArray() {
		if (this.products.length > 0) {
			var firstProduct = this.products[0];
			var firstTitle: any = new Object();
			firstTitle.extend = true;
			firstTitle.descripcion = firstProduct.categoria.nombre;
			this.productsArray.push(firstTitle);
			var actualTitleText = firstProduct.categoria.nombre;
			this.products.forEach(product => {
				var a = 'a';
				if (product.categoria.nombre == actualTitleText) {
					this.productsArray.push(product);
				} else {
					var actualProduct = product;
					var actualTitle: any = new Object();
					actualTitle.extend = true;
					actualTitle.descripcion = actualProduct.categoria.nombre;
					this.productsArray.push(actualTitle);
					this.productsArray.push(product);
					actualTitleText = product.categoria.nombre;
				}
			});
			this.dataSource = this.productsArray;
		}

		/*
		if (this.products.length > 0) {
			var p2 = new Producto();
			var p: any = p2;
			p.extend = true;
			p.descripcion = this.products[0].descripcion;
			this.productsArray.push(p);
			var actualDivison = this.products[0].categoria.nombre;
			var skipFirst = true;
			this.products.forEach(product => {
				if (!skipFirst) {
					if (product.division == actualDivison) {
						this.productsArray.push(product);
						actualDivison = product.categoria.nombre;
					} else {
						var p2 = new Producto();
						var p: any = p2;
						p.extend = true;
						p.descripcion = product.descripcion;
						this.productsArray.push(p);
						this.productsArray.push(product);
						actualDivison = product.categoria.nombre;
					}
				} else {
					skipFirst = false;
				}
			});
			this.dataSource = this.productsArray;
		}
		*/
		//var groupBy1 = new GroupBy();
		//groupBy1.division = this.products[0].categoria.nombre;
		//groupBy1.isGroupBy = true;
		//this.productsArray.push(groupBy1);
	}

	compareProductsByDiv(p1, p2) {
		if (p1.categoria.nombre < p2.categoria.nombre) return -1;
		if (p1.categoria.nombre > p2.categoria.nombre) return 1;
		return 0;
	}

	changeSelectOption(value) {
		this.dropdownSelectedValue = value;
		if (this.isTata) {
			var volumetriaButton = document.getElementById('volumetria');
			var logisticaButton = document.getElementById('logistica');
			if (value == 1) {
				logisticaButton.setAttribute(
					'href',
					'https://api.catalogo.rondanet.com/wishlist/tataIndividualWishlist/' + this.providerId
				);
				volumetriaButton.setAttribute(
					'href',
					'https://api.catalogo.rondanet.com/wishlist/tataListWishlist/' + this.providerId
				);
			} else {
				logisticaButton.setAttribute(
					'href',
					'https://api.catalogo.rondanet.com/wishlist/tataIndividualFull/' + this.providerId
				);
				volumetriaButton.setAttribute(
					'href',
					'https://api.catalogo.rondanet.com/wishlist/tataListFull/' + this.providerId
				);
			}
		}
	}

	exportProducts() {
		this.exportService.setStrategy(this.tiendaInglesaExportService);
		if (this.dropdownSelectedValue == 1) {
			if (this.products.length == 0) {
				this.alertService.error('Para descargar este excel debes seleccionar por lo menos un producto');
			} else {
				this.exportService.performStrategy(
					this.products,
					'' + this.provider,
					'exportacion-productos-seleccionados'
				);
			}
		} else if (this.dropdownSelectedValue == 2) {
			this.exportService.performStrategy(this.allProducts, '' + this.provider, 'exportacion-todos-productos');
		} else {
			this.alertService.error('Seleccione una Opción');
		}
	}

	exportAllProducts() {
		this.exportService.setStrategy(this.tiendaInglesaExportService);
		this.exportService.performStrategy(this.allProducts, '' + this.provider, this.provider.toString());
	}

	clearProducts() {
		this.productsSubscription = this.productosService
			.clearWishlistFromProvider('' + this.providerId)
			.subscribe(response => {
				this.empresasService.emptyWishlistFromProvider(this.providerId);
				var updatedProdArray = new Array<any>();
				this.dataSource = updatedProdArray;
				this.productsArray = updatedProdArray;
				this.products = new Array<Producto>();
			});
	}

	goToProductDetail(item) {
		this.productosService.backArrowToCatalog = false;
		this.router.navigate(['/cliente-producto-detalle', item.id, this.providerId]);
	}

	removeFromWishlist(item) {
		this.productosService.removeFromWishlist(item.id).subscribe(response => {
			var updatedProdArray = this.productsArray.filter(e => e.id != item.id);
			this.dataSource = updatedProdArray;
			this.productsArray = updatedProdArray;
			this.empresasService.removeWishlistFromProvider(this.providerId);
		});
	}
}
