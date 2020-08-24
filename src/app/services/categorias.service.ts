import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { AppConfig } from '../app.config';
import { CatalogoResponse } from '../models/Catalogo/CatalogoResponse';
import { Categoria } from '../models';
import { BehaviorSubject, Observable, throwError as _throw, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoriesDatabase } from '../data-sources';

@Directive()
@Injectable()
export class CategoriasService {
	private categoriasSubject: BehaviorSubject<Categoria[]> = new BehaviorSubject([]);
	public categorias: Categoria[] = [];

	@Output() dataChange: EventEmitter<boolean> = new EventEmitter();
	@Output() selectedCategoryToEditDataChange: EventEmitter<Categoria> = new EventEmitter();

	categoriesDatabase: CategoriesDatabase;

	constructor(private http: HttpClient, private config: AppConfig) {
		this.categoriesDatabase = new CategoriesDatabase();
		this.http.get<CatalogoResponse>(this.config.apiUrl + '/categorias').subscribe(response => {
			if (response.code == 200) {
				this.categorias = response.data as Array<Categoria>;
				this.categoriasSubject.next(this.categorias);
				this.categoriesDatabase.updateCategories(this.categorias);
				this.dataChange.emit(true);
			}
		});
	}

	public getCategories(): Observable<Categoria[]> {
		return this.categoriasSubject.asObservable();
	}

	updateCategories(categories) {
		this.categorias = categories;
		this.categoriasSubject.next(categories);
	}

	public getCategory(id: number): Observable<any> {
		var cat = this.categorias.find(c => c.id === id);
		if (cat !== undefined) {
			let ret = new CatalogoResponse();
			ret.data = cat;
			ret.code = 200;
			return of(ret);
		} else {
			return this.getCategoriesFromProvider(id);
		}
	}

	public getCategoriesApi(): Observable<CatalogoResponse> {
		return this.http.get<CatalogoResponse>(this.config.apiUrl + '/categorias').pipe(catchError(this.handleError));
	}

	public getCategoriesFromProvider(id: number): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/categorias/' + id)
			.pipe(catchError(this.handleError));
	}

	public getCategoriesFromEmpresaProvider(id: number): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/categorias/empresa/' + id)
			.pipe(catchError(this.handleError));
	}

	public editCategory(category: Categoria): Observable<CatalogoResponse> {
		return this.http
			.put<CatalogoResponse>(this.config.apiUrl + '/categorias/productos', category)
			.pipe(catchError(this.handleError));
	}

	public createCategory(category: Categoria): Observable<Categoria> {
		return this.http
			.post<Categoria>(this.config.apiUrl + '/categorias', category)
			.pipe(catchError(this.handleError));
	}

	public loadCategorias() {
		this.http.get<CatalogoResponse>(this.config.apiUrl + '/categorias').subscribe(response => {
			if (response.code == 200) {
				this.categorias = response.data;
				this.categoriasSubject.next(this.categorias);
			}
		});
	}

	public addCategoryToLocalDb(cateogry: Categoria) {
		var catArray = this.categoriasSubject.getValue();
		catArray.push(cateogry);
		this.categoriasSubject.next(catArray);
	}

	public deleteCategoryFromLocalDb(category: Categoria) {
		var catArray = this.categoriasSubject.getValue();
		catArray = catArray.filter(obj => obj.id !== category.id);
		this.categoriasSubject.next(catArray);
	}

	public deleteCategory(category: Categoria): Observable<Categoria | String> {
		return this.http
			.delete<Categoria>(this.config.apiUrl + '/categorias/' + category.id)
			.pipe(catchError(this.handleError));
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
