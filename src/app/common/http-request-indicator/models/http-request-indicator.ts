import { BehaviorSubject } from 'rxjs';

export class HttpRequestIndicator {
	public uid: string;

	public urlExpressions: Array<string>;

	public show: BehaviorSubject<boolean>;

	constructor(uid: string, urlExpressions: Array<string>) {
		this.uid = uid;
		this.urlExpressions = urlExpressions;
		this.show = new BehaviorSubject<boolean>(false);
	}
}
