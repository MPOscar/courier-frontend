import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, Subscription, timer, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ErrorHandlingService } from './error-handling.service';
import { HandledError } from '../models/handled-error';

export enum RequestType {
	Get,
	Post,
	Delete,
	Patch,
	Put,
	Request
}

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
export class ErrorHandlingHttpService {
	protected _currentLanguage = '';
	protected showDialogTime = 70 * 1000;
	protected countDown = 60;
	protected _expire_in = 0;
	protected _sessionExpire$: Subscription;

	constructor(public httpClient: HttpClient, private errorHandlingService: ErrorHandlingService) {}

	get userToken(): string {
		return localStorage.getItem('userToken');
	}

	set userToken(value: string) {
		localStorage.setItem('userToken', value);
	}

	get currentLanguage(): string {
		return this._currentLanguage;
	}

	set currentLanguage(value: string) {
		this._currentLanguage = value;
	}

	getHeaders(): HttpHeaders {
		let requestOptions = new HttpHeaders({
			'Accept-Language': this.currentLanguage ? this.currentLanguage : '',
			'Content-Type': 'application/json',
			Authorization: this.userToken ? 'Bearer ' + this.userToken : ''
		});
		return requestOptions;
	}

	public getRequestOptionArgs(options?: RequestOptions): {} {
		if (options == null) {
			options = {
				headers: this.getHeaders()
			};
		} else {
			if (options.headers == null) {
				options.headers = this.getHeaders();
			}
		}

		return options;
	}

	requestInterceptor<R>(type: RequestType, url: string | HttpRequest<any>, body?: any, options?: any): Observable<R> {
		let request = null;
		switch (type) {
			case RequestType.Get: {
				request = this.httpClient.get(<string>url, this.getRequestOptionArgs(options));
				break;
			}
			case RequestType.Post: {
				request = this.httpClient.post(<string>url, body ? body : null, this.getRequestOptionArgs(options));
				break;
			}
			case RequestType.Delete: {
				request = this.httpClient.delete(<string>url, this.getRequestOptionArgs(options));
				break;
			}
			case RequestType.Patch: {
				request = this.httpClient.patch(<string>url, body ? body : null, this.getRequestOptionArgs(options));
				break;
			}
			case RequestType.Put: {
				request = this.httpClient.put(<string>url, body ? body : null, this.getRequestOptionArgs(options));
				break;
			}
			case RequestType.Request: {
				request = this.httpClient.request(<HttpRequest<any>>url);
				break;
			}
		}
		return request.pipe(
			tap((value: any) => {
				if (value) {
					const { expires_in } = value;

					// handle remaining time
					if (expires_in && expires_in > 0) {
						this._expire_in = expires_in;
						if (this._sessionExpire$) {
							this._sessionExpire$.unsubscribe();
						}
						// Checking if the expiration time is less than X count of seconds and
						// if it's then start a counter for the remaining time between expiration time and notification time
						// X count of seconds before expiration.If isn't, then show the notification immediately
						let timeToShowDialog = this._expire_in * 1000;

						let countDown = this.countDown;
						if (this.showDialogTime < timeToShowDialog) {
							timeToShowDialog -= this.showDialogTime;
							// Send a notification 70 seconds before session expire
							this._sessionExpire$ = timer(timeToShowDialog).subscribe(here => {
								this.errorHandlingService.showExpireNotification.next(countDown);
							});
						} else {
							if (this._expire_in <= this.countDown) {
								countDown = this._expire_in;
							}
							this.errorHandlingService.showExpireNotification.next(countDown);
						}
					}
				}
				// Common place where put code we want to execute for all the request when are success
				this.errorHandlingService.serverOnline.next(true);
			}),
			catchError((handledError: HandledError) => {
				// Common place where put code we want to execute for all the request when are success
				return throwError(handledError);
			})
		);
	}

	request<R>(req: HttpRequest<any>): Observable<R> {
		return this.requestInterceptor(RequestType.Request, req, null);
	}

	get<R>(url: string, options?: RequestOptions): Observable<R> {
		return this.requestInterceptor(RequestType.Get, url, null, options);
	}

	post<R>(url: string, body: any, options?: RequestOptions): Observable<R> {
		return this.requestInterceptor(RequestType.Post, url, body, options);
	}

	put<R>(url: string, body: any, options?: RequestOptions): Observable<R> {
		return this.requestInterceptor(RequestType.Put, url, body, options);
	}

	delete<R>(url: string, options?: RequestOptions): Observable<R> {
		return this.requestInterceptor(RequestType.Delete, url, null, options);
	}

	patch<R>(url: string, body: any, options?: RequestOptions): Observable<R> {
		return this.requestInterceptor(RequestType.Patch, url, body, options);
	}
}

export function errorHandlingServiceFactory(
	errorHandlingService: ErrorHandlingService,
	httpClient: HttpClient
): ErrorHandlingHttpService {
	return new ErrorHandlingHttpService(httpClient, errorHandlingService);
}
