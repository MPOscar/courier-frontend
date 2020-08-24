import { BehaviorSubject } from 'rxjs';

export class MixedDatabase {
	dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
	get data(): any[] {
		return this.dataChange.value;
	}

	add(element) {
		const copiedData = this.data.slice();
		copiedData.push(element);
		this.dataChange.next(copiedData);
	}

	delete(element) {
		var copiedData = this.data.slice();
		copiedData = copiedData.filter(obj => obj !== element);
		this.dataChange.next(copiedData);
	}

	update(users) {
		this.dataChange.next(users);
	}
}
