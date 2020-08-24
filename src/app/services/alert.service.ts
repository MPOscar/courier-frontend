import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class AlertService {
	constructor(private snackBar: MatSnackBar, private router: Router) {}

	success(message: string, action = null) {
		this.snackBar.open(message, action ? action : 'OK', {
			duration: 6000,
			panelClass: ['success-snackbar']
		});
	}

	error(message: string, action = null) {
		this.snackBar.open(message, action ? action : 'OK', {
			duration: 6000,
			panelClass: ['error-snackbar']
		});
	}

	info(message: string, action = null) {
		this.snackBar.open(message, action ? action : 'OK', {
			duration: 6000,
			panelClass: ['info-snackbar']
		});
	}
}
