import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { HttpRequestIndicatorsService } from './http-request-indicators.service';
import { HttpRequestIndicator } from '../models/http-request-indicator';
//import { LoadingService } from '@app/services/loading.service';
import { of } from 'rxjs';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
	private totalRequests = 0;

	//constructor(private loadingService: LoadingService) { }
	constructor(private httpRequestIndicatorsService: HttpRequestIndicatorsService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler) {
		this.totalRequests++;
		this.httpRequestIndicatorsService.setLoading(true);
		return next.handle(request).pipe(
			tap(
				res => {
					if (res instanceof HttpResponse) {
						this.decreaseRequests();
					}
				},
				error => {},
				() => {
					this.decreaseRequests();
				}
			)
		);
	}

	private decreaseRequests() {
		this.totalRequests--;
		if (this.totalRequests === 0) {
			//this.loadingService.setLoading(false);
		}
	}
}
