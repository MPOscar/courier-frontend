import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequestIndicatorsService } from './http-request-indicators.service';
import { HttpRequestIndicator } from '../models/http-request-indicator';
import { tap } from 'rxjs/operators';

@Injectable()
export class IndicatedInterceptor implements HttpInterceptor {
	constructor(private httpRequestIndicatorsService: HttpRequestIndicatorsService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const indicators: Array<HttpRequestIndicator> = this.httpRequestIndicatorsService.findIndicators(
			req.url.toString()
		);
		indicators.forEach(indicator => indicator.show.next(true));
		return next.handle(req).pipe(
			tap(
				event => {
					this.httpRequestIndicatorsService.setLoading(true);
				},
				error => {},
				() => {
					indicators.forEach(indicator => indicator.show.next(false));
				}
			)
		);
	}
}
