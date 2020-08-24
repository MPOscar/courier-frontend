import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../modules/custom-snackbar/components/custom-snackbar/custom-snackbar.component';

@Injectable({
	providedIn: 'root'
})
export class ToastrService {
	constructor(public snackBar: MatSnackBar) {}

	success(message: string, title?: string) {
		this.snackBar.openFromComponent(CustomSnackbarComponent, {
			data: { messageType: 'Success', messageData: message, messageTitle: title },
			duration: 2000,
			horizontalPosition: 'right',
			panelClass: ['background-color-primary']
		});
	}

	error(message: string, title?: string) {
		this.snackBar.openFromComponent(CustomSnackbarComponent, {
			data: { messageType: 'Error', messageData: message, messageTitle: title },
			duration: 2000,
			horizontalPosition: 'right',
			panelClass: ['background-color-accent']
		});
	}
}
