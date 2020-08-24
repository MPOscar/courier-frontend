import { Injectable, ViewChild, Output, EventEmitter, Directive } from '@angular/core';
import { Empresa } from '../models/Empresa/Empresa';

import { BehaviorSubject, Observable } from 'rxjs';
import { CatalogoResponse } from '../models/Catalogo/CatalogoResponse';
import { AppConfig } from '../app.config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from '../../../node_modules/rxjs/operators';
import { _throw } from '../../../node_modules/rxjs/observable/throw';
import { BusinessesDatabase } from '../data-sources';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Directive()
@Injectable()
export class EmpresasService {
	public showCreateBusiness: boolean = false;
	public currentProvider: String;
	public currentProviderName: String;
	public isOnProducts: boolean;
	public isOnProviders: boolean;
	public isOnExport: boolean;
	public isOnSaleList: boolean;

	private businessesSubject: BehaviorSubject<Empresa[]> = new BehaviorSubject([]);
	private businesses: Empresa[] = [];

	@Output() dataChange: EventEmitter<boolean> = new EventEmitter();

	businessesDatabase: BusinessesDatabase;

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	public showModifyBusiness: boolean = false;

	constructor(private http: HttpClient, private config: AppConfig) {
		this.businessesDatabase = new BusinessesDatabase();
		this.http.get<CatalogoResponse>(this.config.apiUrl + '/empresas').subscribe(response => {
			if (response.code == 200) {
				this.businesses = response.data;
				this.businessesDatabase.updateBusinesses(this.businesses);
			}
		});
	}

	public cargarEmpresas() {
		this.http.get<CatalogoResponse>(this.config.apiUrl + '/empresas').subscribe(response => {
			if (response.code == 200) {
				this.businesses = response.data;
				this.businessesSubject.next(this.businesses);

				this.businessesDatabase.updateBusinesses(this.businesses);
			}
		});
	}

	public getEmpresasCatalogo(): Observable<any> {
		return this.http.get<any>(this.config.apiUrl + '/empresas/catalogo').pipe(catchError(this.handleError));
	}

	public getSystemAdminBusinesses(): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/empresas/administradores')
			.pipe(catchError(this.handleError));
	}

	addWishlistToProvider(providerId: number): any {
		this.businesses.forEach(prov => {
			if (prov.id == providerId) {
				prov.wishlistSize++;
			}
		});
	}

	removeWishlistFromProvider(providerId: number): any {
		this.businesses.forEach(prov => {
			if (prov.id == providerId) {
				prov.wishlistSize--;
			}
		});
	}

	emptyWishlistFromProvider(providerId: number): any {
		this.businesses.forEach(prov => {
			if (prov.id == providerId) {
				prov.wishlistSize = 0;
			}
		});
	}

	public getBusinesses(): Observable<Empresa[]> {
		return this.businessesSubject.asObservable();
	}

	public getBussisnesWithVisibilityForList() {
		this.http.get<CatalogoResponse>(this.config.apiUrl + '/empresas/con-visibilidad').subscribe(response => {
			if (response.code == 200) {
				this.businesses = response.data;
				this.businessesSubject.next(this.businesses);
				this.businessesDatabase.updateBusinesses(this.businesses);
			}
		});
	}

	public getBusinessesWithVisibility(): Observable<any> {
		return this.http.get<any>(this.config.apiUrl + '/empresas/con-visibilidad').pipe(catchError(this.handleError));
	}

	public getVisibleProductsForThisBusinesses(id): Observable<any> {
		return this.http
			.get<any>(this.config.apiUrl + '/empresas/' + id + '/productos-visibles')
			.pipe(catchError(this.handleError));
	}

	public create(business: Empresa): Observable<any> {
		let token = localStorage.getItem('token');

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			})
		};

		return this.http.post(this.config.apiUrl + '/empresas', business, httpOptions);
	}

	public createFromAdmin(business: Empresa) {
		let token = localStorage.getItem('token');

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			})
		};

		return this.http.post(this.config.apiUrl + '/empresas/admin', business, httpOptions).pipe(
			map(
				(response: any) => {
					return response;
				},
				err => {
					return false;
				}
			),
			catchError(this.handleError)
		);
	}

	public update(business: Empresa): Observable<any> {
		return this.http.put<Empresa>(this.config.apiUrl + '/empresas', business).pipe(catchError(this.handleError));
	}
	public updateFromAdmin(business: Empresa): Observable<Empresa> {
		business.nuevaBaja = undefined;
		return this.http
			.put<Empresa>(this.config.apiUrl + '/empresas/admin', business)
			.pipe(catchError(this.handleError));
	}

	public inactivate(business: Empresa): Observable<Empresa> {
		return this.http
			.put<Empresa>(this.config.apiUrl + '/empresas/baja', business)
			.pipe(catchError(this.handleError));
	}

	public activate(business: Empresa): Observable<Empresa> {
		return this.http
			.put<Empresa>(this.config.apiUrl + '/empresas/alta', business)
			.pipe(catchError(this.handleError));
	}
	public delete(business: Empresa): Observable<Empresa> {
		let token = localStorage.getItem('token');
		let options = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			}),
			body: business
		};

		return this.http.delete<Empresa>(this.config.apiUrl + '/empresas', options).pipe(catchError(this.handleError));
	}

	public get(empresa: Empresa): Empresa {
		return this.businessesDatabase.data.find(b => b.id == empresa.id);
	}

	public getById(empresaId: number): Empresa {
		return this.businessesDatabase.data.find(b => b.id == empresaId);
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
