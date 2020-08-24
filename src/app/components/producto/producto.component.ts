import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogData } from 'app/models/DialogData/DialogData';
import { DialogService } from 'app/services/dialog.service';
import * as S3 from 'aws-sdk/clients/s3';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Empaque, Empresa, Grupo, Pallet, Presentacion, Producto, Categoria } from '../../models';
import { CategoriasService, PresentacionesService, ProductosService } from '../../services';
import { AlertService, AuthenticationService } from '../../services/index';
import { MustNotMatch } from 'app/shared/validators/mustNotMatch.validator';
import { AppConfig } from 'app/app.config';
import { ImagesService } from 'app/services/image.service';
import { ProductDetailVisibilityComponent } from 'app/components/product-detail-visibility/product-detail-visibility.component';
import { CategoriaGPC } from '../../models/CategoriaGPC/CategoriaGPC';

@Component({
	selector: 'app-producto',
	templateUrl: './producto.component.html',
	styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
	@Input() isCreating: boolean = false;

	@ViewChild(ProductDetailVisibilityComponent)
	productDetailVisibilityComponent: ProductDetailVisibilityComponent;

	product: Producto = null;
	empaques: Array<Empaque> = new Array<Empaque>();
	productForm: FormGroup;
	file: any;
	imgURL: BehaviorSubject<string> = new BehaviorSubject('./assets/images/no-image-available.png');
	uploadedImageUrl: string = '';
	isProviderAdmin = false;
	presentaciones: Presentacion[];
	presentationsSub: Subscription;
	productoSub: Subscription;
	regExNumerosDecimales: string = '^\\d*\\.?\\,?\\d{0,2}$';
	regExNumerosEnteros: string = '^[0-9]*$';

  categoriaGPC: CategoriaGPC;

	constructor(
		private _currentRoute: ActivatedRoute,
		public productosService: ProductosService,
		private fb: FormBuilder,
		private alertService: AlertService,
		private authenticationService: AuthenticationService,
		private router: Router,
		private presentacionesService: PresentacionesService,
		private categoriasService: CategoriasService,
		private dialogService: DialogService,
		private appConfig: AppConfig,
		public imagesService: ImagesService
	) {
		if (
			this.authenticationService.can('editarProductos') ||
			this.authenticationService.can('administradorEmpresa')
		) {
			this.isProviderAdmin = true;
		}

		this.productosService.isEditingProduct = false;
	}

	ngOnInit() {
		this.createProductForm();
		this.cargarPresentaciones();
		if (!this.isCreating) {
			this.cargarProducto();
			if (!this.productosService.isEditingProduct) {
				this.productForm.disable();
			}
		}
	}

	createProductForm() {
		this.productForm = this.fb.group({
			productInfo: this.createProductoInfoForm(),
			empaques: this.createEmpaqueFormArray(),
			pallet: this.createPalletForm()
		});
	}

	getProductoInfoForm(): FormGroup {
		return this.productForm.controls['productInfo'] as FormGroup;
	}

	getEmpaquesForm(): FormArray {
		return this.productForm.controls['empaques'] as FormArray;
	}

	getPalletForm(): FormGroup {
		return this.productForm.controls['pallet'] as FormGroup;
	}

	createProductoInfoForm(): FormGroup {
		return this.fb.group(
			{
				id: null,
				descripcion: ['', Validators.required],
				cpp: ['', Validators.required],
				gtin: ['', Validators.required],
				paisOrigen: [''],
				marca: ['', Validators.required],
				division: [''],
				linea: [''],
				presentacion: [new Presentacion()],
				contenidoNeto: ['', [Validators.required, Validators.pattern(this.regExNumerosDecimales)]],
				unidadMedida: ['', Validators.required],
				pesoBruto: ['', Validators.pattern(this.regExNumerosDecimales)],
				unidadMedidaPesoBruto: [''],
				nivelMinimoVenta: ['', Validators.pattern(this.regExNumerosEnteros)],
				esPromo: false,
				alto: ['', Validators.pattern(this.regExNumerosDecimales)],
				ancho: ['', Validators.pattern(this.regExNumerosDecimales)],
				profundidad: ['', Validators.pattern(this.regExNumerosDecimales)]
			},
			{
				validator: MustNotMatch('division', 'linea')
			}
		);
	}

	createEmpaqueFormArray(): FormArray {
		return this.fb.array([this.createEmpaqueFormGroup()], (control: FormArray) =>
			this.checkEmpaquesRequiredFields(control)
		);
	}

	checkEmpaquesRequiredFields(array: FormArray) {
		for (let i = 0; i < array.length; i++) {
			let currentEmp = array.at(i) as FormGroup;
			if (!this.empaqueFormGroupIsEmpty(currentEmp.value)) {
				this.empaqueRequiredIsFilled(currentEmp);
			}
		}
		return null;
	}

	empaqueRequiredIsFilled(empaque: FormGroup) {
		for (let key in empaque.value) {
			if (key != 'id' && key != 'nivel') {
				if (this.empaqueKeyIsRequired(key) && empaque.controls[key].value == '') {
					empaque.controls[key].setErrors({ empaqueFieldRequired: true });
					empaque.setErrors({ empaqueFieldRequired: true });
				}
			}
		}
	}

	empaqueKeyIsRequired(key: string): boolean {
		return key == 'gtin' || key == 'clasificacion' || key == 'cantidad';
	}

	createEmpaqueFormGroup(): FormGroup {
		return this.fb.group({
			id: null,
			cpp: [''],
			clasificacion: [''],
			gtin: [''],
			pesoBruto: ['', Validators.pattern(this.regExNumerosDecimales)],
			unidadMedida: [''],
			cantidad: ['', Validators.pattern(this.regExNumerosEnteros)],
			alto: ['', Validators.pattern(this.regExNumerosDecimales)],
			ancho: ['', Validators.pattern(this.regExNumerosDecimales)],
			profundidad: ['', Validators.pattern(this.regExNumerosDecimales)],
			nivel: [1]
		});
	}

	createPalletForm(): FormGroup {
		return this.fb.group({
			id: null,
			alto: ['', Validators.pattern(this.regExNumerosDecimales)],
			ancho: ['', Validators.pattern(this.regExNumerosDecimales)],
			profundidad: ['', Validators.pattern(this.regExNumerosDecimales)],
			unidadesVenta: ['', Validators.pattern(this.regExNumerosEnteros)],
			cajas: ['', Validators.pattern(this.regExNumerosEnteros)],
			camadas: ['', Validators.pattern(this.regExNumerosEnteros)]
		});
	}

	setProductoForm() {
		let productInfoObject = {
			id: this.product.id,
			descripcion: this.product.descripcion,
			cpp: this.product.cpp,
			gtin: this.product.gtin,
			paisOrigen: this.product.paisOrigen,
			marca: this.product.marca,
			division: this.product.categoria.nombre,
			linea: this.product.categoria.padre.nombre,
			presentacion: this.product.presentacion,
			contenidoNeto: this.product.contenidoNeto,
			unidadMedida: this.product.unidadMedida,
			pesoBruto: this.product.pesoBruto,
			unidadMedidaPesoBruto: this.product.unidadMedidaPesoBruto,
			nivelMinimoVenta: this.product.nivelMinimoVenta,
			esPromo: this.product.esPromo,
			alto: this.product.alto,
			ancho: this.product.ancho,
			profundidad: this.product.profundidad
		};
		this.getProductoInfoForm().patchValue(productInfoObject);
	}

	setEmpaquesFormArray() {
		let empFormArray: FormArray = this.getEmpaquesForm();
		empFormArray.clear();
		this.empaques.forEach(x => empFormArray.push(this.setEmpaqueFormGroup(x)));
	}

	setEmpaqueFormGroup(empaque: Empaque): FormGroup {
		let empaqueForm = this.createEmpaqueFormGroup();
		empaqueForm.patchValue({
			id: empaque.id,
			cpp: empaque.cpp,
			clasificacion: empaque.clasificacion !== null ? empaque.clasificacion : 'Caja',
			gtin: empaque.gtin,
			pesoBruto: empaque.pesoBruto,
			unidadMedida: empaque.unidadMedida,
			cantidad: empaque.cantidad,
			alto: empaque.alto,
			ancho: empaque.ancho,
			profundidad: empaque.profundidad,
			nivel: empaque.nivel
		});
		if (empaque.gtin > 0) {
			empaqueForm.controls['gtin'].disable();
		}
		return empaqueForm;
	}

	setPalletForm() {
		let palletInfoObject = {
			id: this.product.pallet.id,
			alto: this.product.pallet.alto,
			ancho: this.product.pallet.ancho,
			profundidad: this.product.pallet.profundidad,
			unidadesVenta: this.product.pallet.unidadesVenta,
			cajas: this.product.pallet.cajas,
			camadas: this.product.pallet.camadas
		};
		this.getPalletForm().patchValue(palletInfoObject);
	}

	setAllForms() {
		if (this.product) {
			this.setProductoForm();
			if (this.product.empaques) {
				this.setEmpaquesFormArray();
			}
			if (this.product.pallet) {
				this.setPalletForm();
			}
		}
		if (!this.productosService.isEditingProduct) {
			this.productForm.disable();
		}
	}

	empaquesIsEmpty(): boolean {
		return this.empaques.length === 0;
	}

	palletIsEmpty(): boolean {
		return this.product && (this.product.pallet == null || JSON.stringify(this.product.pallet) === '{}');
	}

	empaqueFormArrayIsEmpty(): boolean {
		let tempEmpaquesForm: FormArray = this.getEmpaquesForm();
		for (let i = 0; i < tempEmpaquesForm.length; i++) {
			let currentEmp = tempEmpaquesForm.at(i).value;
			if (!this.empaqueFormGroupIsEmpty(currentEmp)) {
				return false;
			}
		}
		return true;
	}

	empaqueFormGroupIsEmpty(empaque: FormGroup): boolean {
		for (let key in empaque) {
			if (key != 'id' && key != 'nivel' && empaque[key] != '') return false;
		}
		return true;
	}

	eliminarEmpaquesVacios() {
		let tempEmpaquesForm: FormArray = this.getEmpaquesForm();
		for (let i = 0; i < tempEmpaquesForm.length; i++) {
			let currentEmp = tempEmpaquesForm.at(i).value;
			if (this.empaqueFormGroupIsEmpty(currentEmp)) {
				tempEmpaquesForm.removeAt(i);
			}
		}
	}

	palletFormIsEmpty(): boolean {
		let palletTemp = this.getPalletForm().value;
		for (let key in palletTemp) {
			if (palletTemp[key] != null && palletTemp[key] != '') return false;
		}
		return true;
	}

	/*Esta hardcodeado para 3 niveles de empaques.*/
	arrayEmpaqueAArbol(empaques: Array<Empaque>): Empaque {
		empaques.sort((a, b) => (a.nivel > b.nivel ? 1 : b.nivel > a.nivel ? -1 : 0));
		let empaqueToReturn = null;
		empaques.forEach(empaque => {
			if (empaqueToReturn) {
				if (empaqueToReturn.padre) {
					let padreEmpaque = empaqueToReturn.padre;
					padreEmpaque.padre = empaque;
				} else {
					empaqueToReturn.padre = empaque;
				}
			} else {
				empaqueToReturn = empaque;
			}
		});
		return empaqueToReturn;
	}

	arbolEmpaqueAArray(empaque: Empaque): Array<Empaque> {
		let empaquesRet: Array<Empaque> = [];
		while (empaque != null) {
			empaquesRet.push(empaque);
			empaque = empaque.padre;
		}
		return empaquesRet;
	}

	agregarCPPEmpaquesVacios(empaques: Array<Empaque>) {
		empaques.forEach(pack => {
			if (pack.cpp == '' || pack.cpp == undefined) {
				if (this.product) {
					pack.cpp = '' + this.product.cpp;
				} else {
					pack.cpp = '' + this.getProductoInfoForm().get('cpp').value;
				}
			}
		});
	}

	asignarEmpaquesAProducto(producto: Producto) {
		if (this.empaqueFormArrayIsEmpty()) {
			producto.empaques = null;
		} else {
			this.eliminarEmpaquesVacios();
			let empaquesTemp: Array<Empaque> = this.getEmpaquesForm().value;
			this.agregarCPPEmpaquesVacios(empaquesTemp);
			let arbolEmpaques: Empaque = this.arrayEmpaqueAArbol(empaquesTemp);
			producto.empaques = [arbolEmpaques];
		}
	}

	asignarPalletAProducto(producto: Producto) {
		if (this.palletFormIsEmpty()) {
			producto.pallet = null;
		} else {
			let pallet: Pallet = this.getPalletForm().value;
			producto.pallet = pallet;
		}
	}

	setCategoria(productoFinal: Producto) {
		let catPadre: Categoria = new Categoria('');
		let catHija: Categoria = new Categoria('');
		if (productoFinal.linea !== '') {
			catPadre.nombre = productoFinal.linea;
			catPadre.nivel = 1;
		}
		if (productoFinal.division !== '') {
			catHija.nombre = productoFinal.division;
			catHija.nivel = 2;
		}
		catHija.padre = catPadre;
		productoFinal.categoria = catHija;
		if (productoFinal.categoria && this.productosService.isEditingProduct && this.product.categoria) {
			productoFinal.categoria.id = this.product.categoria.id;
			productoFinal.categoria.padre.id = this.product.categoria.padre.id;
		}
	}

  setCtegoriaGPC(productoFinal: Producto){
    productoFinal.categoriaGPC = this.categoriaGPC;
  }

	consolidateProduct(): Producto {
		let productoFinal: Producto = this.getProductoInfoForm().value;
		this.asignarEmpaquesAProducto(productoFinal);
		this.asignarPalletAProducto(productoFinal);
		this.setCategoria(productoFinal);
		this.setCtegoriaGPC(productoFinal);
		return productoFinal;
	}

	cargarProducto() {
		let productId: number = this._currentRoute.snapshot.params['id'];
		this.productoSub = this.productosService.getProductoFromId(productId).subscribe(x => {
			this.product = x.data;
			this.productosService.selectedProductDetail = this.product;
			if (this.product.pallet == undefined) {
				this.product.pallet = new Pallet();
			}
			this.cargarCategoria();
			if (this.product.foto != undefined) {
				this.imgURL.next(this.appConfig.apiBucket + this.product.foto);
			}
			this.initializeProductPacks();
			this.setAllForms();
		});
	}

	cargarCategoria() {
		if (typeof this.product.categoria == 'number') {
			this.categoriasService.getCategory(this.product.categoria).subscribe(res => {
				this.product.categoria = res.data;
			});
		}
	}

	cargarPresentaciones() {
		this.presentationsSub = this.presentacionesService.getPresentaciones().subscribe(response => {
			this.presentaciones = response;
		});
	}

	initializeProductPacks() {
		this.empaques = this.arbolEmpaqueAArray(this.product.empaques[0]);
	}

	ngOnDestroy() {
		if (this.productosService.comesFromAddProduct) {
			this.productosService.comesFromAddProduct = false;
		}
		if (this.presentationsSub) {
			this.presentationsSub.unsubscribe();
		}
		if (this.productoSub) {
			this.productoSub.unsubscribe();
		}
	}

	saveVisibility() {
		let empresasArray = new Array<Empresa>();
		let gruposArray = new Array<Grupo>();
		let info = {
			id: this.product.id,
			descripcion: 'a',
			empresasConVisibilidad: empresasArray,
			gruposConVisibilidad: gruposArray
		};
		try {
			this.productosService.editProductVisibility(info).subscribe(
				data => {
					this.product.empresasConVisibilidad = empresasArray;
					this.product.gruposConVisibilidad = gruposArray;
					this.productosService.saveNewProductVisibility(this.product, empresasArray, gruposArray);
				},
				error => {
					let httpError = error as HttpErrorResponse;
					if (httpError.status == 401) {
						this.alertService.error('Debes iniciar sesión.', 'OK');
						this.authenticationService.logout();
					} else {
						this.alertService.error('Ocurrió un error.', 'OK');
					}
				}
			);
		} catch (e) {
			this.alertService.error('Ocurrió un error.', 'OK');
		}
	}

	saveProduct() {
		try {
			const productToUpload = this.consolidateProduct();
			if (this.isCreating) {
				this.createProduct(productToUpload);
			} else {
				if (this.file != null && this.file != undefined) {
					this.imagesService.postImagenProducto(this.file, this.product.id).subscribe(response => {
						this.uploadedImageUrl = response.data;
						productToUpload.foto = this.uploadedImageUrl;
						this.editProduct(productToUpload);
					});
				} else {
					this.editProduct(productToUpload);
				}
			}
		} catch (e) {
			this.alertService.error('Ocurrió un error.', 'OK');
		}
	}

	createProduct(productToUpload) {
		this.productosService.createProduct(productToUpload).subscribe(
			data => {
				if (this.file != null && this.file != undefined) {
					let producto: any = data;
					this.imagesService.postImagenProducto(this.file, producto.data.id).subscribe(response => {
						this.uploadedImageUrl = response.data;
						this.manageAddProduct(producto);
					});
				} else {
					this.manageAddProduct(data);
				}
			},
			error => {
				this.productUploadError(error);
			}
		);
	}

	editProduct(productToUpload) {
		this.productosService.editProduct(productToUpload).subscribe(
			data => {
				this.productDetailVisibilityComponent.saveVisibility();
				this.manageEditProduct(data);
			},
			error => {
				this.productUploadError(error);
			}
		);
	}

	productUploadError(httpError: HttpErrorResponse) {
		if (httpError.status == 401) {
			this.alertService.error('Debes iniciar sesión.', 'OK');
			this.authenticationService.logout();
		} else {
			this.alertService.error('Ocurrió un error. - ' + httpError.error.message, 'OK');
		}
	}

	handleImageChangeEvent(image: any) {
		this.file = image;
	}

	goBack() {
		this.productosService.backFromDetail = true;
		this.router.navigate(['/catalogo']);
	}

	openDeleteProduct() {
		let dialogData = new DialogData();
		dialogData.title = 'Eliminar Producto';
		dialogData.content = '¿Seguro que desea eliminar el producto con GTIN ' + this.product.gtinPresentacion + '?';
		dialogData.type = 'warn';
		dialogData.acceptButtonText = 'Eliminar';
		const dialogRef = this.dialogService.open(dialogData);
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.deleteProduct();
			}
		});
	}

	deleteProduct() {
		if (this.product != null && this.product != undefined) {
			try {
				this.productosService.deleteProduct(this.product.id).subscribe(
					data => {
						this.manageDeleteProduct(data);
					},
					error => {
						var httpError = error as HttpErrorResponse;
						if (httpError.status == 401) {
							this.alertService.error('Debes iniciar sesión.', 'OK');
							this.authenticationService.logout();
						} else {
							this.alertService.error('Ocurrió un error.', 'OK');
						}
					}
				);
			} catch (e) {
				this.alertService.error('Ocurrió un error.', 'OK');
			}
		} else {
		}
	}

	manageDeleteProduct = (data: any) => {
		this.router.navigate(['/catalogo']);
		this.alertService.success('Producto eliminado.', 'OK');
	};

	manageEditProduct = (data: any) => {
		var product = data.data;
		this.productosService.saveProduct(product);
		this.alertService.success('Producto Editado.', 'OK');
		this.cargarProducto();
		this.goToSee();
	};

	manageAddProduct = (data: any) => {
		let newProduct = data.data;
		this.alertService.success('Producto Agregado.', 'OK');
		this.productosService.addProductToLocalDb(newProduct);
		this.goBack();
	};

	goToEdit() {
		this.productosService.isEditingProduct = true;
		this.productForm.enable();
		this.getProductoInfoForm()
			.get('gtin')
			.disable();
	}

	goToSee() {
		this.productosService.isEditingProduct = false;
		this.productForm.disable();
	}

	cancelImage() {
		if (this.product.foto != undefined) {
			this.imgURL.next(this.appConfig.apiBucket + this.product.foto);
		}
	}

	cancelEdit() {
		this.setAllForms();
		this.cancelImage();
		this.goToSee();
	}

  updateCategoriaGPC(categoriaGPC: CategoriaGPC){
    this.categoriaGPC = categoriaGPC;
  }
}
