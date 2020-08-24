import { BehaviorSubject } from 'rxjs';
import { ListaDeVenta } from '../models';

export class SaleListsDatabase {
	dataChange: BehaviorSubject<ListaDeVenta[]> = new BehaviorSubject<ListaDeVenta[]>([]);
	get data(): ListaDeVenta[] {
		return this.dataChange.value;
	}

	addSaleList(element) {
		const copiedData = this.data.slice();
		copiedData.push(element);
		this.dataChange.next(copiedData);
	}

	deleteSaleList(element) {
		var copiedData = this.data.slice();
		copiedData = copiedData.filter(obj => obj !== element);
		this.dataChange.next(copiedData);
	}

	updateSaleLists(groups) {
		this.dataChange.next(groups);
	}
}
