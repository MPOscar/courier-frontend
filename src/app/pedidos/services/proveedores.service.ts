import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Proveedor } from 'app/pedidos/models';
import { EmpresasService } from 'app/services';
import { Empresa } from 'app/models';
import { AppConfig } from 'app/app.config';
import { CatalogoResponse } from '../models/Catalogo/CatalogoResponse';
import { filter } from 'rxjs/operators';

@Injectable()
export class ProveedoresService {
	public static noImage: string = './assets/images/no-image-available.png';
	private proveedoresSubject: BehaviorSubject<Proveedor[]> = new BehaviorSubject([]);

	constructor(private http: HttpClient, private empresas: EmpresasService, private config: AppConfig) {
		this.updateProveedores();
	}

	public getProveedores() {
		return this.proveedoresSubject.asObservable();
	}

	/**
	 * Llamada para actualizar los proveedores.
	 * Devuelve un Observable a los Proveedores pues esta llamada no asegura un cambio inmediato.
	 *
	 * @returns {Observable<Proveedor[]>}
	 * @memberof ProveedoresService
	 */
	public updateProveedores(): Observable<Proveedor[]> {
		this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/empresas/proveedores', this.jwt())
			.switchMap((response, index) => {
				let empresas: Empresa[] = [];
				if (response.code == 200) {
					empresas = response.data;
				}
				return Observable.of(empresas);
			})
			.switchMap((item, index) => {
				const proveedores: Proveedor[] = [];
				item.forEach(emp => {
					const prov: Proveedor = new Proveedor();
					prov.id = emp.id;
					prov.direccion = emp.email;
					prov.nombre = emp.nombre;
					prov.rut = parseInt(emp.rut, 10);
					prov.logoUrl = emp.foto == null ? ProveedoresService.noImage : emp.foto;
					proveedores.push(prov);
				});
				return Observable.of(proveedores);
			})
			.subscribe(proveedores => this.proveedoresSubject.next(proveedores));
		return this.getProveedores();
	}

	private jwt() {
		const token = localStorage.getItem('token');
		if (token) {
			const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });
			return { headers };
		}
	}
}
