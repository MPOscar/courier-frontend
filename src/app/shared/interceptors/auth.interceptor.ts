import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from 'app/services';
import { withLatestFrom, map, filter, catchError, flatMap, retryWhen } from 'rxjs/operators';
import { AlertService } from '../../services/index';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	cachedRequests: Array<HttpRequest<any>> = [];

	constructor(private authenticationService: AuthenticationService, public alertService: AlertService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let handler = of(next).pipe(
			withLatestFrom(
				this.authenticationService.tokenIsFresh.pipe(
					filter(val => val == true || request.url.indexOf('/auth/login') != -1)
				)
			),
			map(([next, obs2]) => next),
			map(next => next.handle(this.authenticationService.updateHeader(request))),
			flatMap(a => a),
			catchError(err => {
				if (err instanceof HttpErrorResponse) {
					if (err.status === 401 && err.url.indexOf('/auth/login') == -1) {
						this.handle401Error(request, next);
						return Observable.throw(err);
					}
					this.alertService.error(err.error.message, 'OK');
					return Observable.empty();
				} else {
					this.alertService.error(err.error.message, 'OK');
					return Observable.throw(err);
				}
			}),
			retryWhen(x => {
				return this.authenticationService.tokenIsFresh.pipe(filter(val => val == true)).map(() => {
					return x;
				});
			})
		);

		return handler;
	}

	handle401Error(request: HttpRequest<any>, next: HttpHandler) {
		this.authenticationService.tokenIsFresh.next(false);
		this.authenticationService.openLoginDialog();
	}
}
