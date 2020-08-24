import { BehaviorSubject } from 'rxjs';
import { Producto } from '../models';

export class ProductsDatabasePedido {
	dataChange: BehaviorSubject<Producto[]> = new BehaviorSubject<Producto[]>([]);
	get data(): Producto[] {
		return this.dataChange.value;
	}

	addProduct(element) {
		const copiedData = this.data.slice();
		copiedData.push(element);
		this.dataChange.next(copiedData);
	}

	deleteProduct(element) {
		var copiedData = this.data.slice();
		copiedData = copiedData.filter(obj => obj !== element);
		this.dataChange.next(copiedData);
	}

	updateProducts(products) {
		this.dataChange.next(products);
	}
}
