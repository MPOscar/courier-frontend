import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'excel-upload-info',
	templateUrl: './excel-upload-info.component.html',
	styleUrls: ['./excel-upload-info.component.scss']
})
export class ExcelUploadInfoComponent implements OnInit {
	public titleKey = 'Informacion sobre la actualizacion de productos';

	public messageKey = 'Message';

	public messageParam: any = {};

	public okBtnKey = 'Aceptar';

	public cancelBtnKey = 'Cerrar';

	constructor(
		public dialogRef: MatDialogRef<ExcelUploadInfoComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: any
	) {}

	ngOnInit() {}

	accept(): void {
		this.dialogRef.close(true);
	}

	cancel(): void {
		this.dialogRef.close(false);
	}
}
