import { Injectable } from '@angular/core';
import { Producto, Proveedor } from '../models/index';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProveedoresService {
	private productosSubject: BehaviorSubject<Producto[]> = new BehaviorSubject([]);
	private productos: Producto[] = [];

	private proveedores: Proveedor[];

	constructor(private http: HttpClient) {
		// this.productosSubject.subscribe(_ => this.productos = _);
		this.http.get<Producto[]>('http://localhost:3000/').subscribe(res => {
			this.productos = res;
			this.productosSubject.next(this.productos);
		});
	}

	public getProveedores() {
		return this.http.get('http://localhost:3000/proveedores');
	}

	public getProducto(cpp: number): Producto {
		return this.productos.find((item: Producto) => {
			return item.cpp === cpp;
		});
	}
}
