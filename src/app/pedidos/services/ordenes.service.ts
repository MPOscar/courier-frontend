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
export class OrdenesService {
	private ordenesSubject: BehaviorSubject<Orden[]> = new BehaviorSubject([]);

	private ordenes$ = this.ordenesSubject.asObservable().share();

	public plantillaId: number;

	public nombrePlantilla: string;

	public descripcionPlantilla: string;

	public lugarDeEntrega: String = 'lugarDeEntrega';

	public lugarDeEntregaDescripcion: String = 'lugarDeEntregaDescripcion';

	constructor(private http: HttpClient, private config: AppConfig) {
		// this.http.get<Orden[]>('assets/ordenes.json').subscribe(ordenes => this.ordenesSubject.next(ordenes));
	}

	/**
	 * Este método actualiza el listado de Ordenes de Compra a partir
	 * del criterio de filtrado pasado por parámetros.
	 * Devuelve además un Observable que apunta al listado de Órdenes
	 *
	 * @memberof OrdenesService
	 */
	filtrarOrdenes = (fechaIni: Date, fechaFin: Date) => {
		let filtro = fechaIni !== null && fechaIni !== undefined ? '?fechaIni=' + fechaIni.toISOString() + '&' : '?';
		filtro = filtro + (fechaFin !== null && fechaFin !== undefined ? 'fechaFin=' + fechaFin.toISOString() : '');
		this.http.get<CatalogoResponse>(this.config.apiPedidosUrl + '/oc' + filtro, this.jwt()).subscribe(response => {
			let responseData: Orden[] = [];
			if (response.code === 200) {
				responseData = response.data;
				this.ordenesSubject.next(responseData);
			}
		});
		return this.ordenes$;
	};
	getOrdenes = (): Observable<Orden[]> => this.ordenes$;
	enviarOrden(
		comentario: string,
		nroDocumento: string,
		fechaEntrega: Date,
		productos: ProductoCarrito[]
	): Observable<string[]> {
		const crearOrdenUSD: CrearOrdenRequest = new CrearOrdenRequest();
		crearOrdenUSD.moneda = 'USD';
		crearOrdenUSD.comentario = comentario;
		crearOrdenUSD.fechaEntrega = fechaEntrega.toLocaleDateString();
		crearOrdenUSD.nroDocumento = nroDocumento !== '' && nroDocumento !== '' ? nroDocumento : '';
		crearOrdenUSD.lugarDeEntrega = this.lugarDeEntrega;
		crearOrdenUSD.lugarDeEntregaDescripcion = this.lugarDeEntregaDescripcion;

		const crearOrdenUYU: CrearOrdenRequest = new CrearOrdenRequest();
		crearOrdenUYU.moneda = 'UYU';
		crearOrdenUYU.comentario = comentario;
		crearOrdenUYU.fechaEntrega = fechaEntrega.toLocaleDateString();
		crearOrdenUYU.nroDocumento = nroDocumento !== '' && nroDocumento !== '' ? nroDocumento : '';
		crearOrdenUYU.lugarDeEntrega = this.lugarDeEntrega;
		crearOrdenUYU.lugarDeEntregaDescripcion = this.lugarDeEntregaDescripcion;

		const crearOrdenSinPrecio: CrearOrdenRequest = new CrearOrdenRequest();
		crearOrdenSinPrecio.moneda = '';
		crearOrdenSinPrecio.comentario = comentario;
		crearOrdenSinPrecio.fechaEntrega = fechaEntrega.toLocaleDateString();
		crearOrdenSinPrecio.nroDocumento = nroDocumento !== '' && nroDocumento !== '' ? nroDocumento : '';
		crearOrdenSinPrecio.lugarDeEntrega = this.lugarDeEntrega;
		crearOrdenSinPrecio.lugarDeEntregaDescripcion = this.lugarDeEntregaDescripcion;

		const crearPlantilla: CrearPlantillaRequest = new CrearPlantillaRequest();

		productos.forEach(producto => {
			const productoOC = new ProductoOrdenRequest();
			productoOC.id = '' + producto.id;
			productoOC.cpp = '' + producto.cpp;
			productoOC.gln = producto.listaVenta.ubicacion['codigo'];
			productoOC.gtin = producto.gtin;
			productoOC.listaVenta = producto.listaVenta.id;
			productoOC.unidades = producto.cantidad;
			productoOC.precio = parseFloat('' + producto.precio);

			crearPlantilla.productos.push(productoOC);

			switch (producto.moneda) {
				case 'UYU':
					crearOrdenUYU.productos.push(productoOC);
					break;
				case 'USD':
					crearOrdenUSD.productos.push(productoOC);
					break;
				default:
					crearOrdenSinPrecio.productos.push(productoOC);
					break;
			}
		});

		const crearOrdenSinPrecio$ = this.http
			.post<CatalogoResponse>(this.config.apiPedidosUrl + '/oc', crearOrdenSinPrecio, this.jwt())
			.retry(3);

		const crearOrdenUSD$ = this.http
			.post<CatalogoResponse>(this.config.apiPedidosUrl + '/oc', crearOrdenUSD, this.jwt())
			.retry(3);

		const crearOrdenUYU$ = this.http
			.post<CatalogoResponse>(this.config.apiPedidosUrl + '/oc', crearOrdenUYU, this.jwt())
			.retry(3);

		const crearPlantilla$ = this.http
			.put<CatalogoResponse>(
				this.config.apiPedidosUrl + '/plantillas/finalizar/' + this.plantillaId,
				{ nombre: this.nombrePlantilla, descripcion: this.descripcionPlantilla },
				this.jwt()
			)
			.retry(3);

		return Observable.forkJoin(
			crearOrdenSinPrecio.productos.length > 0 ? crearOrdenSinPrecio$ : Observable.of(null),
			crearOrdenUSD.productos.length > 0 ? crearOrdenUSD$ : Observable.of(null),
			crearOrdenUYU.productos.length > 0 ? crearOrdenUYU$ : Observable.of(null),
			crearPlantilla.productos.length > 0 ? crearPlantilla$ : Observable.of(null)
		).switchMap(([sp, usd, uyu]) => {
			// TODO Modificar para que sea un concat o merge de Peticiones... Manejar los posibles errores del server
			const respuestas: string[] = [];
			if (sp === null) {
			} else if (sp.code === 200) {
				const mensaje = isObject(sp.data)
					? 'Ocurrió un error al crear la Orden Sin Precios'
					: 'Órdenes Sin Precio: ' + sp.data;
				respuestas.push(mensaje);
			} else {
				const mensaje = 'La petición no es correcta. No se creó la Orden de Compra Sin Precios';
				respuestas.push(mensaje);
			}
			if (usd === null) {
			} else if (usd.code === 200) {
				const mensaje = isObject(usd.data)
					? 'Ocurrió un error al crear la Orden en USD'
					: 'Órdenes USD: ' + usd.data;
				respuestas.push(mensaje);
			} else {
				const mensaje = 'La petición no es correcta. No se creó la Orden de Compra en USD';
				respuestas.push(mensaje);
			}
			if (uyu === null) {
			} else if (uyu.code === 200) {
				const mensaje = isObject(uyu.data)
					? 'Ocurrió un error al crear la Orden en UYU'
					: 'Órdenes UYU: ' + uyu.data;
				respuestas.push(mensaje);
			} else {
				const mensaje = 'La petición no es correcta. No se creó la Orden de Compra en UYU';
				respuestas.push(mensaje);
			}

			return Observable.of(respuestas);
		});
	}

	public descargarOC(orden: Orden, formato) {
		const oc = orden;
		this.http
			.get(this.config.apiPedidosUrl + '/oc/' + orden.id + '/documento?formato=' + formato, {
				observe: 'body',
				responseType: 'text',
				...this.jwt()
			})
			.subscribe(response => {
				const data = new Blob([response], { type: 'text/plain' });
				const url = window.URL.createObjectURL(data);
				const tab = window.open(url, '', '_blank');
			});
	}
	public obtenerOC(orden: Orden): Observable<OC> {
		return this.http
			.get<OC>(this.config.apiPedidosUrl + '/oc/' + orden.id + '/documento?formato=JSON', this.jwt())
			.switchMap(response => {
				if (response) {
					return Observable.of(response);
				}
				return Observable.of(null);
			});
	}

	public obtenerUltimaPlantilla(): Observable<any> {
		return this.http.get<any>(this.config.apiPedidosUrl + '/plantillas/ultima/', this.jwt()).switchMap(response => {
			if (response) {
				return Observable.of(response);
			}
			return Observable.of(null);
		});
	}

	public obtenerTodasLasPlantillas(): Observable<any> {
		return this.http.get<any>(this.config.apiPedidosUrl + '/plantillas/all', this.jwt()).switchMap(response => {
			if (response) {
				return Observable.of(response);
			}
			return Observable.of(null);
		});
	}

	public obtenerPlantilla(id): Observable<any> {
		return this.http.get<any>(this.config.apiPedidosUrl + '/plantillas/' + id, this.jwt()).switchMap(response => {
			if (response) {
				return Observable.of(response);
			}
			return Observable.of(null);
		});
	}

	public finalizarPlantilla(): Observable<any> {
		return this.http.put<CatalogoResponse>(
			this.config.apiPedidosUrl + '/plantillas/finalizar/' + this.plantillaId,
			{ nombre: this.nombrePlantilla, descripcion: this.descripcionPlantilla },
			this.jwt()
		);
	}

	public crearNuevaPlantilla(plantilla): Observable<any> {
		console.log(plantilla);
		return this.http.post<CatalogoResponse>(
			this.config.apiPedidosUrl + '/plantillas/crearNuevaPlantilla/',
			plantilla,
			this.jwt()
		);
	}

	public eliminarPlantilla(id): Observable<any> {
		return this.http
			.delete<any>(this.config.apiPedidosUrl + '/plantillas/' + id, this.jwt())
			.switchMap(response => {
				if (response) {
					return Observable.of(response);
				}
				return Observable.of(null);
			});
	}

	public clonarPlantilla(id): Observable<any> {
		return this.http.post<any>(this.config.apiPedidosUrl + '/plantillas/' + id, this.jwt()).switchMap(response => {
			if (response) {
				return Observable.of(response);
			}
			return Observable.of(null);
		});
	}

	public eliminarProductosPlantilla(id): Observable<any> {
		return this.http
			.delete<any>(this.config.apiPedidosUrl + '/plantillas/productos/' + id, this.jwt())
			.switchMap(response => {
				if (response) {
					return Observable.of(response);
				}
				return Observable.of(null);
			});
	}

	public actualizarUltimaPlantilla(plantillaId, producto): Observable<any> {
		return this.http
			.put<OC>(this.config.apiPedidosUrl + '/plantillas/' + plantillaId, producto, this.jwt())
			.switchMap(response => {
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
