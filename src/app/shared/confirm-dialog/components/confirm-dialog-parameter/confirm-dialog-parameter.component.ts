import { Component, Inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//import { setTranslations } from '@c/ngx-translate';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogData } from '../../models/confirm-dialog-data';

@Component({
	selector: 'confirm-dialog-parameter',
	templateUrl: './confirm-dialog-parameter.component.html',
	styleUrls: ['./confirm-dialog-parameter.component.css']
})
export class ConfirmDialogParameterComponent {
	public titleKey = 'Title';

	public messageKey = 'Message';

	public messageParam: any = {};

	public okBtnKey = 'Aceptar';

	public cancelBtnKey = 'Cancelar';

	nombre = '';

	constructor(
		private translate: TranslateService,
		public dialogRef: MatDialogRef<ConfirmDialogParameterComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
	) {
		//setTranslations(this.translate, TRANSLATIONS);
	}

	accept(): void {
		if (this.nombre !== '') {
			this.dialogRef.close(this.nombre);
		}
	}

	cancel(): void {
		this.dialogRef.close(false);
	}
}
