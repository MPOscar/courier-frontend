import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { AppConfig } from '../app.config';
import { CatalogoResponse } from '../models/Catalogo/CatalogoResponse';
import { Categoria } from '../models';
import { BehaviorSubject, Observable, throwError as _throw, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoriesDatabase } from '../data-sources';

@Injectable({
  providedIn: 'root'
})
export class CategoriaGPCService {


	constructor(private http: HttpClient, private config: AppConfig) {
	}

	public getSegmentos(): Observable<CatalogoResponse> {
		return this.http.get<CatalogoResponse>(this.config.apiUrl + '/gpc/segment').pipe(catchError(this.handleError));
	}

  public getFamilias(segmentCode: string): Observable<CatalogoResponse> {
    return this.http.get<CatalogoResponse>(this.config.apiUrl + '/gpc/segment/' + segmentCode + '/familias').pipe(catchError(this.handleError));
  }

  public getClases(segmentCode: string): Observable<CatalogoResponse> {
    return this.http.get<CatalogoResponse>(this.config.apiUrl + '/gpc/familia/' + segmentCode + '/clases').pipe(catchError(this.handleError));
  }

  public getBriks(segmentCode: string): Observable<CatalogoResponse> {
    return this.http.get<CatalogoResponse>(this.config.apiUrl + '/gpc/clase/' + segmentCode + '/bricks').pipe(catchError(this.handleError));
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
