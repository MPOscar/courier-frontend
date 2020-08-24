import { BehaviorSubject } from 'rxjs';
import { Empresa, Grupo } from '../models';

export class GroupBusinessesDatabase {
	dataChange: BehaviorSubject<(Grupo | Empresa)[]> = new BehaviorSubject<(Grupo | Empresa)[]>([]);
	get data(): (Grupo | Empresa)[] {
		return this.dataChange.value;
	}

	addElement(element) {
		const copiedData = this.data.slice();
		copiedData.push(element);
		this.dataChange.next(copiedData);
	}
	index: number;
	selectedIndex: number;
	removeElement(element) {
		this.index = -1;
		this.selectedIndex = -1;
		const copiedData = this.data.slice();
		copiedData.forEach(business => this.getIndex(element, business));
		if (this.selectedIndex !== -1) {
			copiedData.splice(this.selectedIndex, 1);
		}
		this.dataChange.next(copiedData);
	}

	changeElement(element) {
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

	getIndex(element: Grupo | Empresa, business: Grupo | Empresa) {
		this.index++;
		if (element.id == business.id) {
			this.selectedIndex = this.index;
		}
	}

	updateElement(businesses) {
		this.dataChange.next(businesses);
	}
}
