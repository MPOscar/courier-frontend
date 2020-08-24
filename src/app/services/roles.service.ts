import { Injectable } from '@angular/core';
import { Observable, throwError as _throw } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { CatalogoResponse } from 'app/models/Catalogo/CatalogoResponse';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RolesService {
	constructor(private http: HttpClient, private config: AppConfig) {}

	public getRoles(): Observable<CatalogoResponse> {
		return this.http.get<CatalogoResponse>(this.config.apiUrl + '/roles').pipe(catchError(this.handleError));
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
