import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Orden, ProductoCarrito, CrearOrdenRequest, ProductoOrdenRequest } from 'app/pedidos/models';
import { CrearPlantillaRequest } from '../models/Orden/CrearPlantillaRequest';
import { AppConfig } from 'app/app.config';
import { CatalogoResponse } from 'app/models/Catalogo/CatalogoResponse';
import { isObject } from 'rxjs/internal/util/isObject';
import { OC } from '../models/Edi/OCEDI';

@Injectable()
export class SucursalService {
	constructor(private http: HttpClient, private config: AppConfig) {}

	public obtenerSucursales(): Observable<any> {
		return this.http.get<any>(this.config.apiPedidosUrl + '/sucursales/', this.jwt()).switchMap(response => {
			if (response) {
				return Observable.of(response);
			}
			return Observable.of(null);
		});
	}

	private jwt() {
		const token = localStorage.getItem('token');
		if (token) {
			const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });
			return { headers };
		}
	}
}
