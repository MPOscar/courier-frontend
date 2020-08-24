import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpErrorResponse,
	HttpResponse
} from '@angular/common/http';
//
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/internal/operators';
//
import { ErrorHandlingService } from '../services/error-handling.service';

@Injectable({
	providedIn: 'root'
})
export class ErrorHandlingInterceptorService implements HttpInterceptor {
	constructor(private httpClient: HttpClient, private errorHandlingService: ErrorHandlingService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			tap(request => {
				if (request instanceof HttpResponse) {
					this.errorHandlingService.serverOnline.next(true);
				}
				return request;
			}),
			catchError((error: HttpErrorResponse) => {
				// Common place where put code we want to execute for all the request when are success
				return throwError(this.errorHandlingService.handleServiceError(error));
			})
		);
	}
}
