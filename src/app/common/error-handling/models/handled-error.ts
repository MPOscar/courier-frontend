import { NavigationExtras } from '@angular/router';

export class HandledError {
	public error: Error;
	public logoutCommands: any[];
	public logoutNavigationExtras?: NavigationExtras;
	public errorCode: number;
	public formErrors: any;
	public message = '';
	constructor() {
		this.error = new Error();
	}
}
