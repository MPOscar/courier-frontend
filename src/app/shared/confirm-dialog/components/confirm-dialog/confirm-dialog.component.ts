import { Component, Inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//import { setTranslations } from '@c/ngx-translate';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogData } from '../../models/confirm-dialog-data';

@Component({
	selector: 'confirm-dialog',
	templateUrl: './confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
	public titleKey = 'Title';

	public messageKey = 'Message';

	public messageParam: any = {};

	public okBtnKey = 'Aceptar';

	public cancelBtnKey = 'Cancelar';

	constructor(
		private translate: TranslateService,
		public dialogRef: MatDialogRef<ConfirmDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
	) {
		//setTranslations(this.translate, TRANSLATIONS);
	}

	accept(): void {
		this.dialogRef.close(true);
	}

	cancel(): void {
		this.dialogRef.close(false);
	}
}
