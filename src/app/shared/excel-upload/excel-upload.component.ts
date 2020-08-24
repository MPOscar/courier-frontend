import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { AlertService, ProductosService } from 'app/services';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { ExcelUploadInfoComponent } from '../excel-upload-info/excel-upload-info.component';
@Component({
	selector: 'excel-upload',
	templateUrl: './excel-upload.component.html',
	styleUrls: ['./excel-upload.component.scss']
})
export class ExcelUploadComponent implements OnInit {
	@ViewChild('fileInput', { static: true }) fileInput: ElementRef;
	file = null;

	excelOpcion: string = 'actualizar';

	laboratorio: boolean = false;

	progressButtonOptions: MatProgressButtonOptions = {
		active: false,
		text: 'Cargar',
		spinnerSize: 18,
		raised: true,
		stroked: false,
		buttonColor: 'primary',
		spinnerColor: 'primary',
		fullWidth: false,
		disabled: false,
		mode: 'indeterminate'
	};

	constructor(
		public dialog: MatDialog,
		public dialogRef: MatDialogRef<ExcelUploadComponent>,
		@Inject(MAT_DIALOG_DATA) public dataReceived: Subject<any>,
		private alertService: AlertService,
		private productosService: ProductosService
	) {}

	ngOnInit() {}

	resetDialog(): void {
		this.file = null;
		this.progressButtonOptions.active = false;
		this.progressButtonOptions.text = 'Cargar';
	}

	uploadFiles() {
		if (this.file == null) {
			this.alertService.error('Debe seleccionar un archivo');
			return;
		}
		this.progressButtonOptions.active = true;

		this.cargarExcel();
	}

	cargarExcel() {
		const formData: FormData = new FormData();
		if (!this.laboratorio) {
			formData.append('file', this.file, this.file.name);
			this.productosService.cargarProductosExcel(formData, this.excelOpcion).subscribe(
				response => {
					if (response.code == 200) {
						this.uploadSuccess(response);
					} else {
						this.uploadFailed();
					}
				},
				error => {
					this.uploadFailed();
					console.log(error.error);
				}
			);
		} else {
			formData.append('productos', this.file, this.file.name);
			this.productosService.cargarProductosExcelLaboratorio(formData).subscribe(
				response => {
					if (response.code == 200) {
						this.showUploadErrors(response.data);
					} else {
						this.uploadFailed();
					}
				},
				error => {
					this.uploadFailed();
					console.log(error.error);
				}
			);
		}
	}

	uploadSuccess(response) {
		let resArray = response.data.split('*');
		if (resArray[1] != null) {
			const link = document.createElement('a');
			link.target = '_blank';
			link.href = 'http://s3.us-east-2.amazonaws.com/' + resArray[1].trim();
			link.setAttribute('visibility', 'hidden');
			link.click();
			this.alertService.error(
				resArray[0] +
					' - Se descarga un excel con los errores, si no se descarga por favor habilite los popups. Le hemos enviado un email con los detalles de la carga de productos al catalogo.'
			);
		} else {
			this.alertService.success(resArray[0]);
		}
		this.resetDialog();
		this.productosService.setLoaderVisibility(true);
		this.dataReceived.next(true);
	}

	showUploadErrors(data: any) {
		let resultSubject = new Subject();
		const dialogRef = this.dialog.open(ExcelUploadInfoComponent, {
			width: '90%',
			data: { data }
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});

		this.dialogRef.close();
	}

	uploadFailed() {
		this.alertService.error('No se pudo cargar el archivo Excel');
		this.dataReceived.next(false);
	}

	selectFile(event) {
		this.file = event[0];
	}
}
