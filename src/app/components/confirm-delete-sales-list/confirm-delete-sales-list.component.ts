import { Component, Inject, OnInit } from '@angular/core';
import { ListaDeVenta } from 'app/models';
import { SaleListService, AuthenticationService, AlertService } from 'app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-confirm-delete-sales-list',
	templateUrl: './confirm-delete-sales-list.component.html',
	styleUrls: ['./confirm-delete-sales-list.component.scss']
})
export class ConfirmDeleteSalesListComponent implements OnInit {
	listToDelete: ListaDeVenta;
	data: any[];

	constructor(
		private saleListService: SaleListService,
		private authenticationService: AuthenticationService,
		private route: ActivatedRoute,
		private router: Router,
		private alertService: AlertService,
		public dialogRef: MatDialogRef<ConfirmDeleteSalesListComponent>,
		@Inject(MAT_DIALOG_DATA) public dataReceived: any[]
	) {
		this.data = dataReceived;
		this.listToDelete = this.data['list'];
	}

	ngOnInit() {}

	onNoClick(): void {
		this.dialogRef.close();
	}

	delete() {
		try {
			this.saleListService.deleteSaleList(this.listToDelete).subscribe(
				data => {
					this.manageDeleteSaleList(data);
				},
				error => {
					var httpError = error as HttpErrorResponse;
					if (httpError.status == 401) {
						this.alertService.error('Debes iniciar sesión.', 'OK');
						this.authenticationService.logout();
					} else {
						this.alertService.error('Ocurrió un error: ' + httpError.error.message, 'OK');
					}
				}
			);
		} catch (e) {
			this.alertService.error('Ocurrió un error.', 'OK');
		}
		this.dialogRef.close();
	}

	manageDeleteSaleList(data: any): any {
		this.alertService.success('Lista de ventas eliminada con éxito', 'OK');
		var deleted = data.data as ListaDeVenta;
		this.saleListService.saleListsDatabase.deleteSaleList(deleted);
		this.saleListService.deleteSaleListFromLocalDb(deleted);
		this.saleListService.dataChange.emit(true);
	}
}
