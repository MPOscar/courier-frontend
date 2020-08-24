import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto, Categoria, Empaque, Presentacion } from '../../../models';
import { ProductosService, EmpresasService } from '../../../services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, AuthenticationService, GruposService } from '../../../services/index';
import { AppConfig } from 'app/app.config';

@Component({
	selector: 'app-supermarket-product-detail',
	templateUrl: './supermarket-product-detail.component.html',
	styleUrls: ['./supermarket-product-detail.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
			state('*', style({ height: '*', visibility: 'visible' })),
			transition('void <=> *', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
		]),
		trigger('buttonRotate', [
			state('default', style({ transform: 'rotate(0)' })),
			state('rotated', style({ transform: 'rotate(-180deg)' })),
			transition('rotated => default', animate('200ms ease-out')),
			transition('default => rotated', animate('200ms ease-in'))
		]),
		trigger('collapseChange', [
			state('true', style({ height: '0', overflow: 'hidden' })),
			state('false', style({ height: '*' })),
			transition('* => *', animate('.25s ease-in'))
		])
	]
})
export class SupermarketProductDetailComponent implements OnInit {
	providerId: number;
	id: number;
	product: Producto;
	productForm: FormGroup;
	measurementUnits: String[] = ['EA', 'kg', 'gr', 'cc', 'm3', 'lb'];
	weightUnits: String[] = ['kg', 'gr', 'lb'];

	productPacks: Array<Empaque>;
	showForm: boolean = false;

	constructor(
		private _currentRoute: ActivatedRoute,
		private _router: Router,
		private productosService: ProductosService,
		private empresasService: EmpresasService,
		private fb: FormBuilder,
		private alertService: AlertService,
		private authenticationService: AuthenticationService,
		private router: Router,
		private groupsService: GruposService,
		public appConfig: AppConfig
	) {
		this.id = this._currentRoute.snapshot.params['id'];
		this.providerId = this._currentRoute.snapshot.params['providerId'];
		this.productosService.getProductoFromId(this.id).subscribe(x => {
			this.product = x.data;
			if (this.product.categoria != undefined && this.product.categoria.padre == undefined)
				this.product.categoria.padre = new Categoria('');
			this.productPacks = undefined;
			this.productPacks = new Array<Empaque>();
			if (this.product.empaques != undefined) {
				if (this.product.empaques.length > 0) {
					this.productPacks.push(this.product.empaques[0]);
					if (this.product.empaques[0].padre) {
						this.productPacks.push(this.product.empaques[0].padre);
					}
				}
			}
			this.productPacks.forEach(pack => {
				if (pack.cpp == '' || pack.cpp == undefined) {
					pack.cpp = '' + this.product.cpp;
				}
			});

			this.productForm = fb.group({
				nombre: [undefined, [Validators.required]],
				marca: [undefined, [Validators.required]],
				pais: [undefined, [Validators.required]],
				cpp: [undefined, [Validators.required]],
				gtin: [undefined, [Validators.required]],
				contenidoNeto: [undefined, [Validators.required]],
				pesoBruto: [undefined, [Validators.required]],
				presentacion: [undefined, [Validators.required]],
				minimoVenta: [undefined, [Validators.required]],
				unidadMedidaContenidoNeto: [undefined, [Validators.required]],
				unidadMedidaPesoBruto: [undefined, [Validators.required]],
				division: [undefined, [Validators.required]],
				linea: [undefined, [Validators.required]],
				alto: [undefined, [Validators.required]],
				ancho: [undefined, [Validators.required]],
				profundidad: [undefined, [Validators.required]]
			});

			this.productForm.controls['unidadMedidaContenidoNeto'].setValue(this.product.unidadMedida);
			this.productForm.controls['unidadMedidaPesoBruto'].setValue(this.product.unidadMedidaPesoBruto);

			this.showForm = true;
		});
	}

	ngOnInit() {}

	goBack() {
		if (this.productosService.backArrowToCatalog) {
			this.productosService.backFromDetail = true;
			this.router.navigate(['/catalogo-proveedor', this.providerId]);
		} else {
			this.router.navigate(['/lista-exportacion-proveedor', this.providerId]);
		}
	}

	addToWishlist(productId) {
		//selectedFilters
		if (this.product != null && this.product != undefined) {
			this.productosService.addToWishlist(productId).subscribe(response => {
				this.product.enWishlist = true;
				this.empresasService.addWishlistToProvider(this.providerId);
			});
		}
	}

	removeFromWishlist(productId) {
		//selectedFilters
		if (this.product != null && this.product != undefined) {
			this.productosService.removeFromWishlist(productId).subscribe(response => {
				this.product.enWishlist = false;
				this.empresasService.removeWishlistFromProvider(this.providerId);
			});
		}
	}

	register() {}
}
