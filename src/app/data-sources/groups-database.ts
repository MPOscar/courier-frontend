import { BehaviorSubject } from 'rxjs';
import { Grupo } from '../models';

export class GroupsDatabase {
	dataChange: BehaviorSubject<Grupo[]> = new BehaviorSubject<Grupo[]>([]);
	get data(): Grupo[] {
		return this.dataChange.value;
	}

	addGroup(element) {
		const copiedData = this.data.slice();
		copiedData.push(element);
		this.dataChange.next(copiedData);
	}

	deleteGroup(element) {
		var copiedData = this.data.slice();
		copiedData = copiedData.filter(obj => obj !== element);
		this.dataChange.next(copiedData);
	}

	updateGroups(groups) {
		this.dataChange.next(groups);
	}
}
