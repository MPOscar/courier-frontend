import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { AppConfig } from '../app.config';
import { CatalogoResponse } from '../models/Catalogo/CatalogoResponse';
import { BehaviorSubject, Observable, throwError as _throw } from 'rxjs';
import { Presentacion } from '../models';
import { catchError } from 'rxjs/operators';

@Directive()
@Injectable()
export class PresentacionesService {
	private presentacionesSubject: BehaviorSubject<Presentacion[]> = new BehaviorSubject([]);
	public presentaciones: Presentacion[] = [];
	@Output() dataChange: EventEmitter<boolean> = new EventEmitter();

	constructor(private http: HttpClient, private config: AppConfig) {
		this.http.get<CatalogoResponse>(this.config.apiUrl + '/presentaciones').subscribe(response => {
			if (response.code == 200) {
				this.presentaciones = response.data;
				this.presentacionesSubject.next(this.presentaciones);
			}
		});
		this.dataChange.emit(true);
	}

	public getPresentaciones(): Observable<Presentacion[]> {
		return this.presentacionesSubject.asObservable();
	}
	public getPresentacionesApi(): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/presentaciones')
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
