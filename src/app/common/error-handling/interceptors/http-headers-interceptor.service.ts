import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpEvent,
	HttpHandler,
	HttpHeaders,
	HttpInterceptor,
	HttpParams,
	HttpRequest
} from '@angular/common/http';
//
import { Observable } from 'rxjs';
//
import { ErrorHandlingService } from '../services/error-handling.service';

export interface RequestOptions {
	headers?: HttpHeaders;
	observe?: 'body';
	params?: HttpParams;
	reportProgress?: boolean;
	responseType?: 'json';
	withCredentials?: boolean;
	body?: any;
}

@Injectable({
	providedIn: 'root'
})
export class HttpHeadersInterceptorService implements HttpInterceptor {
	protected _currentLanguage = '';

	constructor(public httpClient: HttpClient, private errorHandlingService: ErrorHandlingService) {}

	get userToken(): string {
		return localStorage.getItem('token');
	}

	set userToken(value: string) {
		localStorage.setItem('token', value);
	}

	get currentLanguage(): string {
		return this._currentLanguage;
	}

	set currentLanguage(value: string) {
		this._currentLanguage = value;
	}

	public getHeaders(): HttpHeaders {
		const requestOptions = new HttpHeaders({
			'Accept-Language': this.currentLanguage ? this.currentLanguage : '',
			'Content-Type': 'application/json',
			Authorization: this.userToken ? 'Bearer ' + this.userToken : ''
			//'useroauth': this.userToken ? this.userToken : '',
		});
		return requestOptions;
	}

	public getRequestOptionArgs(request: HttpRequest<any>): HttpRequest<any> {
		if (request.headers.keys().length === 0) {
			const headers = this.getHeaders();
			const req = request.clone({
				setHeaders: {
					'Accept-Language': headers.get('Accept-Language'),
					'Content-Type': headers.get('Content-Type'),
					Authorization: headers.get('Authorization')
					//'useroauth': headers.get('useroauth'),
				}
			});
			return req;
		} else {
			return request;
		}
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		request = this.getRequestOptionArgs(request);
		return next.handle(request);
	}
}
