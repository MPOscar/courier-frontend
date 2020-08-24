import { BehaviorSubject } from 'rxjs';
import { Empresa } from '../models';

export class BusinessesDatabase {
	dataChange: BehaviorSubject<Empresa[]> = new BehaviorSubject<Empresa[]>([]);
	get data(): Empresa[] {
		return this.dataChange.value;
	}

	addBusiness(element) {
		const copiedData = this.data.slice();
		copiedData.push(element);
		this.dataChange.next(copiedData);
	}
	index: number;
	selectedIndex: number;
	removeBusiness(element) {
		this.index = -1;
		this.selectedIndex = -1;
		const copiedData = this.data.slice();
		copiedData.forEach(business => this.getIndex(element, business));
		if (this.selectedIndex !== -1) {
			copiedData.splice(this.selectedIndex, 1);
		}
		this.dataChange.next(copiedData);
	}

	changeBusiness(element) {
		this.index = -1;
		this.selectedIndex = -1;
		const copiedData = this.data.slice();
		copiedData.forEach(business => this.getIndex(element, business));
		if (this.selectedIndex !== -1) {
			copiedData[this.selectedIndex].nombre = element.nombre;
			// copiedData.splice(this.selectedIndex, 1);
			//copiedData.push(element);
		}
		this.dataChange.next(copiedData);
	}

	getIndex(element: Empresa, business: Empresa) {
		this.index++;
		if (element.id == business.id) {
			this.selectedIndex = this.index;
		}
	}

	updateBusinesses(businesses) {
		this.dataChange.next(businesses);
	}
}
