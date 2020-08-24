import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { Producto, Empresa, ListaDeVenta, Grupo } from 'app/models';
import { BehaviorSubject, Observable, throwError as _throw } from 'rxjs';
import { SaleListsDatabase } from 'app/data-sources';
import { AppConfig } from 'app/app.config';
import { CatalogoResponse } from 'app/models/Catalogo/CatalogoResponse';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Directive()
@Injectable()
export class SaleListService {
	public name = '';
	public description = '';
	public secondStepDone = false;
	public thirdStepDone = false;
	public products = Array<Producto>();
	public businesses = Array<Empresa>();
	public groups = Array<Grupo>();

	public showList: boolean;
	public showCreateList: boolean;
	public showEdit: boolean;
	public showWatch: boolean;
	public listToEdit: ListaDeVenta;
	public isProvider: boolean;

	public pageIndex = 0;
	public pageSize = 25;

	private saleListsSubject: BehaviorSubject<ListaDeVenta[]> = new BehaviorSubject([]);
	private saleLists: ListaDeVenta[] = [];

	@Output() dataChange: EventEmitter<boolean> = new EventEmitter();
	@Output() selectedSaleListToEditDataChange: EventEmitter<ListaDeVenta> = new EventEmitter();

	saleListsDatabase: SaleListsDatabase;
	otherSaleList: boolean = false;
	public canCreate: boolean;

	private loaderVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);

	constructor(private http: HttpClient, private config: AppConfig) {
		this.saleListsDatabase = new SaleListsDatabase();
		/*this.http.get<CatalogoResponse>(this.config.apiUrl + '/listasDeVenta').subscribe(response => {
			if (response.code == 200) {
				var saleListList = new Array<ListaDeVenta>();
				response.data.forEach(function(saleListReceived) {
					var g = saleListReceived;
					g.empresas = Array<Empresa>();
					g.listaEmpresas.forEach(function(businessFromSaleList) {
						g.empresas.push(businessFromSaleList);
					});
					g.grupos = Array<Grupo>();
					g.listaGrupos.forEach(function(groupFromSaleList) {
						g.grupos.push(groupFromSaleList);
					});

					g.productos = Array<Producto>();
					g.listaProductos.forEach(function(productFromSaleList) {
						g.productos.push(productFromSaleList);
					});
					saleListList.push(g);
				});
				this.saleLists = saleListList;
				this.saleListsSubject.next(this.saleLists);
				if (this.saleLists.length > 0) {
					this.showList = true;
					this.showCreateList = false;
				}
				this.dataChange.emit(true);
				this.loaderVisibleSubject.next(false);
			}
		});*/
	}

	public loadSaleList() {
		this.saleListsDatabase = new SaleListsDatabase();
		/*this.http.get<CatalogoResponse>(this.config.apiUrl + '/listasDeVenta/empresas').subscribe(response => {
			if (response.code == 200) {
				var saleListList = new Array<ListaDeVenta>();
				response.data.forEach(function(saleListReceived) {
					var g = saleListReceived;
					g.empresas = Array<Empresa>();
					g.listaEmpresas.forEach(function(businessFromSaleList) {
						g.empresas.push(businessFromSaleList);
					});
					g.grupos = Array<Grupo>();
					g.listaGrupos.forEach(function(groupFromSaleList) {
						g.grupos.push(groupFromSaleList);
					});

					g.productos = Array<Producto>();
					g.listaProductos.forEach(function(productFromSaleList) {
						g.productos.push(productFromSaleList);
					});
					saleListList.push(g);
				});
				this.saleLists = saleListList;
				this.saleListsSubject.next(this.saleLists);
				if (this.saleLists.length > 0) {
					this.showList = true;
					this.showCreateList = false;
				}
				this.dataChange.emit(true);
				this.loaderVisibleSubject.next(false);
			}
		});*/
	}

	public loadSaleListId(id) {
		this.saleListsDatabase = new SaleListsDatabase();
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/listasDeVenta/' + id)
			.pipe(catchError(this.handleError));
	}

	public loadSaleListsBasic(): Observable<any> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/listasDeVenta/empresa')
			.pipe(catchError(this.handleError));
	}

	public getFromProvider(id: string): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/listasDeVenta/supermarket/' + id)
			.pipe(catchError(this.handleError));
	}

	public getFromProviderPedido(id: string): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/listasDeVenta/supermarketPedido/' + id)
			.pipe(catchError(this.handleError));
	}

	public getLoaderVisibility() {
		return this.loaderVisibleSubject.asObservable();
	}

	public setLoaderVisibility(state: boolean) {
		this.loaderVisibleSubject.next(state);
	}

	public getSaleLists(): Observable<ListaDeVenta[]> {
		return this.saleListsSubject.asObservable();
	}

	public getSaleListById(saleListId: number): ListaDeVenta {
		return this.saleListsSubject.getValue().find(g => g.id == saleListId);
	}
	//public getSaleListById(): ListaDeVenta

	public getSaleListsApi(): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/listasDeVenta')
			.pipe(catchError(this.handleError));
	}

	public createSaleList(saleList: ListaDeVenta): Observable<ListaDeVenta> {
		return this.http
			.post<ListaDeVenta>(this.config.apiUrl + '/listasDeVenta', saleList)
			.pipe(catchError(this.handleError));
	}

	public addSaleListToLocalDb(saleList: ListaDeVenta) {
		var saleListArray = this.saleListsSubject.getValue();
		saleListArray.push(saleList);
		this.saleListsSubject.next(saleListArray);
	}

	public editSaleList(saleList: ListaDeVenta): Observable<ListaDeVenta> {
		return this.http
			.put<ListaDeVenta>(this.config.apiUrl + '/listasDeVenta', saleList)
			.pipe(catchError(this.handleError));
	}

	public deleteSaleList(saleList: ListaDeVenta): Observable<ListaDeVenta> {
		return this.http
			.delete<ListaDeVenta>(this.config.apiUrl + '/listasDeVenta/' + saleList.id)
			.pipe(catchError(this.handleError));
	}

	public deleteSaleListFromLocalDb(saleList: ListaDeVenta) {
		var saleListArray = this.saleListsSubject.getValue();
		saleListArray = saleListArray.filter(obj => obj.id !== saleList.id);
		this.saleListsSubject.next(saleListArray);
	}

	private handleError(error: HttpErrorResponse) {
		console.log('error');
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
		}
		// return an observable with a user-facing error message
		return _throw(error);
	}
}
