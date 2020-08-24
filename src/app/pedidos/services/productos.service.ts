import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AppConfig } from 'app/app.config';
import { Empaque, Pallet, Producto } from 'app/models';
import { BehaviorSubject, Observable, throwError as _throw } from 'rxjs';
import { CatalogoResponse } from '../models/Catalogo/CatalogoResponse';

@Injectable()
export class ProductosService {
	private productosSubject: BehaviorSubject<Producto[]> = new BehaviorSubject([]);
	private productosSubject$ = this.productosSubject.share();

	constructor(private http: HttpClient, private config: AppConfig) {}

	public getEmpaques = (idEmpresa: number, idProducto: number) =>
		this.http
			.get<CatalogoResponse>(
				this.config.apiUrl + `/productos/empresas/${idEmpresa}/${idProducto}/empaques`,
				this.jwt()
			)
			.switchMap((response, index) => {
				let empaques: Empaque[] = [];
				if (response.code === 200) {
					empaques = response.data;
				}
				return Observable.of(empaques);
			});

	public getPallet = (idEmpresa: number, idProducto: number) =>
		this.http
			.get<CatalogoResponse>(
				this.config.apiUrl + `/productos/empresas/${idEmpresa}/${idProducto}/pallet`,
				this.jwt()
			)
			.switchMap((response, index) => {
				let pallet: Pallet = null;
				if (response.code === 200) {
					pallet = response.data;
				}
				return Observable.of(pallet);
			});

	/**
	 * Llamada para actualizar los productos a partir del Id de la Lista de Venta pasada por parámetro.
	 * Devuelve un Observable a los Productos pues esta llamada no asegura un cambio inmediato.
	 *
	 * @param {Number} idListaVenta
	 * @returns {Observable<Producto[]>}
	 * @memberof ProductosService
	 */
	public updateProductos(
		idListaVenta: Number,
		moneda: string,
		pideUnidad: string,
		discontinuados: boolean = false,
		suspendidos: boolean = false,
		ocultarDiscontinuados: boolean = false,
		ocultarSuspendidos: boolean = false
	): Observable<Producto[]> {
		// TODO Mejorar agregando HttpParams y no variables en la URL... de esta forma se puede extraer el Observable
		// del ámbito de este método y compartir peticiones
		this.http
			.get<CatalogoResponse>(
				this.config.apiPedidosUrl +
					'/listaventa/' +
					idListaVenta +
					'/productos?moneda=' +
					moneda +
					'&pideUnidad=' +
					pideUnidad +
					'&discontinuados=' +
					discontinuados +
					'&suspendidos=' +
					suspendidos +
					'&ocultarDiscontinuados=' +
					ocultarDiscontinuados +
					'&ocultarSuspendidos=' +
					ocultarSuspendidos,
				this.jwt()
			)
			.switchMap((response, index) => {
				let productos: Producto[] = [];
				if (response.code === 200) {
					productos = response.data;
				}
				return Observable.of(productos);
			})
			.map(productos => {
				productos = this.mapearProductos(productos, moneda);
				return productos;
			})
			.subscribe(
				productos => {
					this.productosSubject.next(productos);
				},
				e => console.error(e)
			);
		return this.getProductos();
	}

	public getFromProviderPedidoProductosPlantilla(
		idListaVenta: string,
		productos: Array<number>,
		moneda: string,
		pideUnidad: string
	): Observable<any> {
		// TODO Mejorar agregando HttpParams y no variables en la URL... de esta forma se puede extraer el Observable
		// del ámbito de este método y compartir peticiones
		return this.http
			.post<any>(
				this.config.apiPedidosUrl +
					'/listaventa/' +
					idListaVenta +
					'/planilla/productos?moneda=' +
					moneda +
					'&pideUnidad=' +
					pideUnidad,
				{
					productos: productos
				},
				this.jwt()
			)
			.pipe(catchError(this.handleError));
	}

	public getFromProviderPedidoProductosPlantillaa(id: string, productos: Array<number>): Observable<any> {
		return this.http
			.post<any>(
				this.config.apiPedidosUrl + '/listasDeVenta/' + id + '/planilla/productos',
				{
					productos: productos
				},
				this.jwt()
			)
			.pipe(catchError(this.handleError));
	}

	/**
	 * Método temporal para mapear de manera correcta los datos obtenidos desde Rondanet y darle
	 * precedencia sobre los datos que se encuentren en el Catálogo Nuevo.
	 * Se implementa este mapeo aquí y no en el Backend debido a que en un futuro se va a eliminar este
	 * circuito por lo que simplemente sería eliminar este método y nos quedaríamos con los datos del Catálogo Nuevo.
	 * La complejidad de implementación y corrección en el Backend sería mayor.
	 *
	 * @public
	 * @param {Producto[]} productos
	 * @returns {Producto[]}
	 * @memberof ProductosService
	 */
	public mapearProductos(productos: Producto[], moneda: string): Producto[] {
		productos.forEach(producto => {
			producto.foto = this.config.apiBucket + producto.foto;
			producto['moneda'] = moneda;
			const datosPedidos: Object[] = [...producto['pedidos']];
			datosPedidos.forEach(datoPedido => {
				if (datoPedido['cpp'] === producto.cpp) {
					producto.cajacamad = parseInt(datoPedido['empaques'], 10);
					producto.camadpall = parseInt(datoPedido['camadas'], 10);
					producto.nivelMinimoVenta = datoPedido['unidades'];
					producto.descripcion = datoPedido['descripcion'];
					producto.esPromo = datoPedido['esPromo'] === 'S';
					producto.nuevo = this.esNuevo(producto);
					producto.suspendidoDesde =
						producto.suspendidoDesde != undefined && producto.suspendidoDesde !== null
							? new Date(producto.suspendidoDesde)
							: null;
					producto.suspendidoHasta =
						producto.suspendidoHasta != undefined && producto.suspendidoHasta !== null
							? new Date(producto.suspendidoHasta)
							: null;
					producto['moneda'] = datoPedido['moneda'] || moneda;
					producto['linea'] = datoPedido['linea'];
					producto['division'] = datoPedido['division'];
					producto.precio =
						datoPedido['precio'] === 'null' ||
						datoPedido['precio'] === undefined ||
						datoPedido['precio'] === null
							? 0
							: parseFloat(datoPedido['precio']);
				}
			});
		});
		return productos;
	}

	public esNuevo(productos: Producto): boolean {
		let fechaCreacion = new Date(productos.fechaCreacion);
		let differenceInTime = new Date().getTime() - fechaCreacion.getTime();
		let differenceInDays = differenceInTime / (1000 * 3600 * 24);
		return 0 <= differenceInDays && differenceInDays <= 10;
	}

	getProductos = (): Observable<Producto[]> => this.productosSubject$;

	private jwt() {
		const token = localStorage.getItem('token');
		if (token) {
			const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });
			return { headers };
		}
	}

	private handleError(error: HttpErrorResponse) {
		console.log('error');
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
		}
		// return an observable with a user-facing error message
		return _throw(error);
	}
}
