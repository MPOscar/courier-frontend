import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
@Injectable()
export class AppConfig {
	// TODO Hacer que la condiguración se cargue desde un archivo JSON. Propuesta utilizar fromfetch
	// public readonly _apiUrl = 'http://api.test.catalogo.rondanet.com:8080';
	// private _apiPedidosUrl = 'https://api-test-pedidos.rondanet.com:8443';
	// private _apiPedidosUrl = 'http://192.168.200.193:89';
	// private _apiUrl = 'http://192.168.200.193:8080';
	//public readonly _apiUrl = 'http://ec2-54-90-58-17.compute-1.amazonaws.com:8080';
	//public readonly _apiUrl = 'http://boxlb-cunaonline-test-catalogo-1316863947.us-east-1.elb.amazonaws.com:8080';
	private _apiPedidosUrl = '';
	private _apiUrl = '';
	private _apiBucket = '';

	constructor() {}

	loadConfig() {
		return new Promise((resolve, reject) => {
			const data$ = fromFetch('./assets/env.json').pipe(
				switchMap(response => {
					if (response.ok) {
						// OK return data
						return response.json();
					} else {
						// Server is returning a status requiring the client to try something else.
						return of({ error: true, message: `Error ${response.status}` });
					}
				}),
				catchError(err => {
					// Network or other error, handle appropriately
					console.error(err);
					return of({ error: true, message: err.message });
				})
			);

			data$.subscribe({
				next: result => {
					this._apiPedidosUrl = result['apiPedidosUrl'];
					this._apiUrl = result['apiUrl'];
					this._apiBucket = result['apiBucket'];
					resolve(true);
				}
			});
		});
	}
	get apiPedidosUrl() {
		return this._apiPedidosUrl;
	}
	set apiPedidosUrl(value) {}
	get apiUrl() {
		return this._apiUrl;
	}
	set apiUrl(value) {}

	get apiBucket() {
		return this._apiBucket;
	}
	set apiBucket(value) {}
}
