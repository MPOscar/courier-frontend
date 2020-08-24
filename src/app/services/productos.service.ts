import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Producto } from '../models/Producto/Producto';
import { Empresa } from '../models/Empresa/Empresa';
import { Grupo } from '../models/Grupo/Grupo';
import { BehaviorSubject, Observable, throwError as _throw, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CatalogoResponse } from '../models/Catalogo/CatalogoResponse';
import { AppConfig } from '../app.config';
import 'rxjs/Rx';
import { VisibilityRequest } from 'app/models';
//
import {
	HttpHeadersInterceptorService,
	RequestOptions
} from '../common/error-handling/interceptors/http-headers-interceptor.service';

@Injectable()
export class ProductosService {
	private productosSubject: BehaviorSubject<Producto[]> = new BehaviorSubject([]);
	private productos: Producto[] = [];
	public selectedFilters: string[] = [];
	public selectedMarcas: string[] = [];
	public selectedLineas: string[] = [];
	public selectedDivisiones: string[] = [];
	public backFromDetail: boolean = false;
	public backArrowToCatalog: boolean = true;
	public pageIndex = 0;
	public pageSize = 25;
	public sort = 'descripcion';
	public uploadedImageUrl = '';
	public comesFromAddProduct: boolean;
	public onlyDetail = false;
	public isMasiveVisibility: boolean = false;

	public wishlistFromProvider: string[] = [];

	public productsForMassiveVisibility: Producto[];
	public businessesForMassiveVisibility: Empresa[];
	public groupsForMassiveVisibility: Grupo[];
	public productsForMassiveVisibilityChosen = false;
	public businessesForMassiveVisibilityChosen = false;
	public groupsForMassiveVisibilityChosen = false;
	public privacyChosen = false;

	public showVisibilityBusinessList = false;
	public showVisibilitySingleBusiness = false;
	public showVisibilityMassive = false;
	businessForVisibility: Empresa;
	editBusinessVisibility: boolean;
	selectedProductDetail: Producto;
	public isEditingProduct: boolean;
	public massiveIsPrivate: boolean;
	public massiveIsPublic: boolean;

	public displayedColumnsGroupsHeader = ['checkbox', 'tituloGrupo', 'nombre', 'razonSocial'];
	public displayedColumnsBusinessesOfGroup = ['emptyCheckbox', 'tituloGrupo', 'nombre', 'razonSocial'];
	public displayedColumnsGroup = ['checkbox', 'nombre'];

	private loaderVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);

	// Propiedades de ayuda
	public displayedColumns = ['nombre', 'rut', 'razonSocial', 'quitar'];
	public displayedColumnsBusinesses = ['checkbox', 'nombre', 'rut', 'razonSocial'];
	public displayedColumnsGroups = ['nombre', 'quitar'];

	constructor(
		private http: HttpClient,
		private config: AppConfig,
		private httpHeaders: HttpHeadersInterceptorService
	) {
		this.loadProductos();
	}

	public loadProductos() {
		this.http.get<CatalogoResponse>(this.config.apiUrl + '/productos/empresa').subscribe(response => {
			if (response.code == 200) {
				this.productos = response.data;
				this.productosSubject.next(this.productos);
			}
			this.loaderVisibleSubject.next(false);
		});
	}

	public getLoaderVisibility() {
		return this.loaderVisibleSubject.asObservable();
	}

	public setLoaderVisibility(state: boolean) {
		this.loaderVisibleSubject.next(state);
	}

	public clearProducts() {
		this.productos = new Array<Producto>();
		this.productosSubject.next(this.productos);
	}

	public getProductosApi(): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(
				this.config.apiUrl +
					'/productos/empresa/?page=' +
					this.pageIndex +
					'&limit=' +
					this.pageSize +
					this.getFilters() +
					'&sort=' +
					this.sort
			)
			.pipe(catchError(this.handleError));
	}

	public getProductosExportarExcel(): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(
				this.config.apiUrl +
					'/productos/exportar/?page=' +
					this.pageIndex +
					'&limit=' +
					this.pageSize +
					this.getFilters() +
					'&sort=' +
					this.sort
			)
			.pipe(catchError(this.handleError));
	}

	public getProductosApiVisibles(id): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(
				this.config.apiUrl +
					'/productos/empresa/' +
					id +
					'/?page=' +
					this.pageIndex +
					'&limit=' +
					this.pageSize +
					this.getFilters() +
					'&sort=' +
					this.sort
			)
			.pipe(catchError(this.handleError));
	}

	public getProductosFiltros(idEmpresa = 0): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/productos/empresa/filtros/' + idEmpresa)
			.pipe(catchError(this.handleError));
	}

	public getMyProductsExcel(formatId: number) {
		return this.http
			.get(this.config.apiUrl + '/wishlist/misProductos/' + formatId, this.blobHeader())
			.pipe(map(res => (<any>res)._body))
			.subscribe((res: Response) => {
				var a = document.createElement('a');
				a.href = URL.createObjectURL(res.blob());
				a.download = 'fileName';
				// start download
				a.click();
			});
	}

	public getWishlistFromProvider(id: string): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/wishlist/' + id)
			.pipe(catchError(this.handleError));
	}

	public addToWishlist(productId: number): Observable<CatalogoResponse> {
		return this.http
			.post<CatalogoResponse>(this.config.apiUrl + '/wishlist/' + productId, [])
			.pipe(catchError(this.handleError));
	}

	removeFromWishlist(productId: any): any {
		return this.http
			.delete<CatalogoResponse>(this.config.apiUrl + '/wishlist/' + productId)
			.pipe(catchError(this.handleError));
	}

	clearWishlistFromProvider(providerId: string): any {
		return this.http
			.delete<CatalogoResponse>(this.config.apiUrl + '/wishlist/clearForProvider/' + providerId)
			.pipe(catchError(this.handleError));
	}

	public getVisible(id: string): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/productos/visibles/' + id)
			.pipe(catchError(this.handleError));
	}

	public getFromProvider(id: string): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/productos/empresa/' + id)
			.pipe(catchError(this.handleError));
	}

	public getProductos(): Observable<Producto[]> {
		return this.productosSubject.asObservable();
	}

	public addProductToLocalDb(product: Producto) {
		this.productos.push(product);
		this.productosSubject.next(this.productos);
	}

	public editProduct(product: Producto): Observable<Producto> {
		return this.http.put<Producto>(this.config.apiUrl + '/productos', product).pipe(catchError(this.handleError));
	}

	public createProduct(product: Producto): Observable<Producto> {
		return this.http.post<Producto>(this.config.apiUrl + '/productos', product).pipe(catchError(this.handleError));
	}
	public saveMassiveVisibility(addVisibility = true, isMasive = false) {
		var visibilityRequest: VisibilityRequest = new VisibilityRequest();

		visibilityRequest.empresas = [];
		visibilityRequest.grupos = [];

		if (this.businessesForMassiveVisibilityChosen) {
			visibilityRequest.esPrivado = true;
			visibilityRequest.esPublico = false;
			visibilityRequest.empresas = this.createBusinessArrayOnlyIds(this.businessesForMassiveVisibility);
		}
		if (this.groupsForMassiveVisibilityChosen) {
			visibilityRequest.esPrivado = true;
			visibilityRequest.esPublico = false;
			visibilityRequest.grupos = this.createGroupArrayOnlyIds(this.groupsForMassiveVisibility);
		}
		visibilityRequest.isMasive = isMasive;
		visibilityRequest.addVisibility = addVisibility;
		visibilityRequest.productos = this.createProductArrayOnlyIds(this.productsForMassiveVisibility);
		visibilityRequest.esPrivado = this.massiveIsPrivate;
		visibilityRequest.esPublico = this.massiveIsPublic;
		return this.http
			.put<Producto>(this.config.apiUrl + '/productos/visibilidadMultiple', visibilityRequest)
			.pipe(catchError(this.handleError));
	}

	public saveBusinessVisibility(emp: Empresa, prods: Producto[]) {
		var visibilityRequest: VisibilityRequest = new VisibilityRequest();
		visibilityRequest.empresas = [{ id: emp.id }];
		visibilityRequest.grupos = [];
		visibilityRequest.productos = prods;
		return this.http
			.put<Producto>(this.config.apiUrl + '/productos/visibilidadEmpresa', visibilityRequest)
			.pipe(catchError(this.handleError));
	}

	createBusinessArrayOnlyIds(array: Empresa[]): Array<Empresa> {
		var ret = Array<Empresa>();
		array.forEach(element => {
			var emp = new Empresa();
			emp.id = element.id;
			ret.push(emp);
		});
		return ret;
	}

	createProductArrayOnlyIds(array: Producto[]): Array<Producto> {
		var ret = Array<Producto>();
		array.forEach(element => {
			var emp = new Producto();
			emp.id = element.id;
			ret.push(emp);
		});
		return ret;
	}

	createGroupArrayOnlyIds(array: Grupo[]): Array<Grupo> {
		var ret = Array<Grupo>();
		array.forEach(element => {
			var emp = new Grupo('', '', []);
			emp.id = element.id;
			ret.push(emp);
		});
		return ret;
	}

	public editProductVisibility(info: any): Observable<Producto> {
		return this.http
			.put<Producto>(this.config.apiUrl + '/productos/visibilidad', info)
			.pipe(catchError(this.handleError));
	}

	public getProducto(cpp: number): Producto {
		return this.productos.find((item: Producto) => {
			return item.cpp === cpp;
		});
	}

	public setProductos(productos: Producto[]) {
		this.productos = productos;
	}

	public getProductoById(producto: Producto): Producto {
		return this.productos.find(p => p.id == producto.id);
	}

	public getProductoFromId(id: number): Observable<CatalogoResponse> {
		// let localProduct = this.productos.find(p => p.id == id);
		// if (localProduct !== undefined) {
		// 	let ret = new CatalogoResponse();
		// 	ret.data = localProduct;
		// 	ret.code = 200;
		// 	return of(ret);
		// } else {
		let localBusiness = JSON.parse(localStorage.getItem('business'));
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/productos/empresas/' + localBusiness.id + '/' + id)
			.pipe(catchError(this.handleError));
		// }
	}

	public getVisibilidadProductoFromId(id: number): Observable<CatalogoResponse> {
		let localBusiness = JSON.parse(localStorage.getItem('business'));
		return this.http
			.get<CatalogoResponse>(
				this.config.apiUrl + '/productos/empresas/' + localBusiness.id + '/' + id + '/visibilidad'
			)
			.pipe(catchError(this.handleError));
		// }
	}

	public deleteProduct(id: number): Observable<Producto> {
		return this.http.delete<Producto>(this.config.apiUrl + '/productos/' + id).pipe(catchError(this.handleError));
	}

	public saveProduct(product: Producto) {
		var existing = this.productos.find(p => p.id == product.id);
		var index = this.productos.indexOf(existing);
		this.productos.splice(index, 1);
		this.addProductToLocalDb(product);
		//var a = 1;
		//a++;

		//	existing = product;
		/*var prodArray = this.productosSubject.getValue();
		prodArray = prodArray.filter(obj => obj.id !== product.id);
		this.productosSubject.next(prodArray);
		var productsArray = this.productosSubject.getValue();
		productsArray.push(product);
		this.productosSubject.next(productsArray);*/
	}

	public saveNewProductVisibility(product: Producto, businesses: Empresa[], groups: Grupo[]) {
		var prodArray = this.productosSubject.getValue();
		prodArray = prodArray.filter(obj => obj.id !== product.id);
		this.productosSubject.next(prodArray);
		var productsArray = this.productosSubject.getValue();
		product.empresasConVisibilidad = businesses;
		product.gruposConVisibilidad = groups;
		productsArray.push(product);
		this.productosSubject.next(productsArray);
	}

	public cargarProductosExcel(fileToUpload: FormData, opcion: string) {
		const requestOptions: RequestOptions = { headers: this.httpHeaders.getHeaders() };
		requestOptions.headers = requestOptions.headers.delete('Content-Type');
		let url = '';
		switch (opcion) {
			case 'actualizar':
				url = '/?actualizarExistentes=true';
				break;
			case 'eliminar':
				url = '/?eliminarExistentes=true';
				break;
			default:
				break;
		}
		return this.http.post<CatalogoResponse>(
			this.config.apiUrl + '/productos/excel' + url,
			fileToUpload,
			requestOptions
		);
	}

	public cargarProductosExcelLaboratorio(fileToUpload: FormData) {
		const requestOptions: RequestOptions = { headers: this.httpHeaders.getHeaders() };
		requestOptions.headers = requestOptions.headers.delete('Content-Type');
		return this.http.post<CatalogoResponse>(
			this.config.apiUrl + '/productosLaboratorio/actualizar',
			fileToUpload,
			requestOptions
		);
	}

	public cargarImagenesProductos(filesToUpload: FormData) {
		const requestOptions: RequestOptions = { headers: this.httpHeaders.getHeaders() };
		requestOptions.headers = requestOptions.headers.delete('Content-Type');
		return this.http.post<CatalogoResponse>(
			this.config.apiUrl + '/productos/imagenes',
			filesToUpload,
			requestOptions
		);
	}

	public getAccessKey(): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/productos/getAccessKey')
			.pipe(catchError(this.handleError));
	}

	public uploadProductoImagen(file: File, productoId: number): Observable<any> {
		let data: any = {
			file: file
		};
		return this.http
			.post<CatalogoResponse>(this.config.apiUrl + '/file/producto/' + productoId, data)
			.pipe(catchError(this.handleError));
	}

	private blobHeader() {
		let a = 'S';
		let token = localStorage.getItem('token'); //s
		if (token) {
			let headers = new HttpHeaders({
				Authorization: 'Bearer ' + token,
				responseType: 'application/octet-stream' as 'application/octet-stream'
			});
			return { headers };
		}
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error.message}`);
		}
		// return an observable with a user-facing error message
		return _throw(error);
	}

	public getFilters() {
		let filters = '';
		this.selectedFilters.forEach(item => {
			filters += '&filters=' + encodeURIComponent(item);
		});

		this.selectedMarcas.forEach(item => {
			filters += '&marcas=' + encodeURIComponent(item);
		});

		this.selectedDivisiones.forEach(item => {
			filters += '&divisiones=' + encodeURIComponent(item);
		});

		this.selectedLineas.forEach(item => {
			filters += '&lineas=' + encodeURIComponent(item);
		});
		return filters;
	}

	public resetFilters() {
		this.selectedFilters = [];
		this.selectedMarcas = [];
		this.selectedDivisiones = [];
		this.selectedLineas = [];
		this.pageIndex = 1;
		this.pageSize = 25;
	}

	public isProductInWishList(productId): boolean {
		return (
			this.wishlistFromProvider.findIndex(item => {
				return item === productId;
			}) > -1
		);
	}
}
