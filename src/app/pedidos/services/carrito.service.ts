import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ProductoCarrito } from 'app/pedidos/models';

@Injectable()
export class CarritoService {
	private itemsInCartSubject: BehaviorSubject<ProductoCarrito[]> = new BehaviorSubject([]);
	private itemsInCart: ProductoCarrito[] = [];

	constructor() {
		this.itemsInCartSubject.subscribe(itemsInCart => (this.itemsInCart = itemsInCart));
	}

	public addToCarrito(item: ProductoCarrito) {
		const producto = this.itemsInCart.find(prod => prod.cpp === item.cpp && prod.gtin === item.gtin);
		if (producto) {
			producto.cantidad = item.cantidad;
			producto.gtin = item.gtin;
			producto.listaVenta = item.listaVenta;
			this.itemsInCartSubject.next(this.itemsInCart); // TODO Revisar esta implementacion. Mejorar forma de identificar Updates o pasar a manejo de estados completamente
		} else {
			this.itemsInCart.push(item);
			this.itemsInCartSubject.next(this.itemsInCart);
		}

		localStorage.setItem('itemsInCart', JSON.stringify(this.itemsInCart));
	}

	public getCarrito(): Observable<ProductoCarrito[]> {
		return this.itemsInCartSubject.asObservable();
	}

	public remove(cpp: number, gtin: string): void {
		const items = this.itemsInCartSubject.getValue();
		this.itemsInCartSubject.next(items.filter(item => item.cpp !== cpp && gtin !== item.gtin));
	}

	public empty(): void {
		this.itemsInCartSubject.next([]);
	}
}
