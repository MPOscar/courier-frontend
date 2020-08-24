import { BehaviorSubject } from 'rxjs';
import { Categoria } from '../models';

export class CategoriesDatabase {
	dataChange: BehaviorSubject<Categoria[]> = new BehaviorSubject<Categoria[]>([]);
	get data(): Categoria[] {
		return this.dataChange.value;
	}

	addCategory(element) {
		const copiedData = this.data.slice();
		copiedData.push(element);
		this.dataChange.next(copiedData);
	}

	deleteCategory(element) {
		var copiedData = this.data.slice();
		copiedData = copiedData.filter(obj => obj !== element);
		this.dataChange.next(copiedData);
	}

	updateCategories(categories) {
		this.dataChange.next(categories);
	}
}
