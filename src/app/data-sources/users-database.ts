import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models';

export class UsersDatabase {
	dataChange: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([]);
	get data(): Usuario[] {
		return this.dataChange.value;
	}

	addUser(element) {
		const copiedData = this.data.slice();
		copiedData.push(element);
		this.dataChange.next(copiedData);
	}

	deleteUser(element) {
		var copiedData = this.data.slice();
		copiedData = copiedData.filter(obj => obj !== element);
		this.dataChange.next(copiedData);
	}

	updateUsers(users) {
		this.dataChange.next(users);
	}
}
