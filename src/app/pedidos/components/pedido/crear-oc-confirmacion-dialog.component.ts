import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/DialogData/DialogData';
import { trigger, state, transition, animate, style } from '@angular/animations';

export enum Estado {
	Info = 'info',
	Accept = 'accept',
	Decline = 'decline'
}

@Component({
	selector: 'app-pedidos-oc-confirm-dialog',
	templateUrl: 'crear-oc-confirmacion-dialog.html',
	styleUrls: ['crear-oc-confirmacion-dialog.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('slide', [
			state('in', style({ transform: 'translateY(0)' })),
			state('out', style({ transform: 'translateY(-100%)' })),
			transition('in <=> out', animate('300ms cubic-bezier(0.8, 0.0, 0.2, 1)')),
			transition('out <=> in', animate('300ms cubic-bezier(0.8, 0.0, 0.2, 1)'))
		])
	]
})
export class CrearOCConfirmacionDialogComponent {
	public estadoInicial: Estado = Estado.Info;
	public estado: Estado = Estado.Info;
	public transicion = 'in';
	public disableActions = false;
	public nombrePedido: string = '';
	public numeroOrden = '';
	public mensaje = '';
	public titulo = 'Confirmación';
	public cancelButtonText = 'Cancelar';
	public okButtonText = 'Aceptar';
	public ICON = {
		accept: '/assets/png/dialog/accept.png',
		decline: '/assets/png/dialog/decline.png',
		info: '/assets/png/dialog/attention.png'
	};
	public actualIcon = this.ICON[this.estadoInicial];

	constructor(
		public dialogRef: MatDialogRef<CrearOCConfirmacionDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.titulo = data.titulo ? data.titulo : this.titulo;
		this.mensaje = data.mensaje ? data.mensaje : this.mensaje;
		this.numeroOrden = data.numeroOrden ? data.numeroOrden : this.numeroOrden;
		this.okButtonText = data.okButtonText ? data.okButtonText : this.okButtonText;
		this.cancelButtonText = data.cancelButtonText ? data.cancelButtonText : this.cancelButtonText;
		this.estadoInicial = data.estadoInicial ? data.estadoInicial : this.estadoInicial;
		this.estado = this.estadoInicial;
	}
	onNoClick(): void {
		this.estado = Estado.Decline;
		this.disableActions = true;
		this.transicion = 'out';
	}

	onAcceptClick() {
		this.estado = Estado.Accept;
		this.disableActions = true;
		this.transicion = 'out';
	}

	onAnimationFinish(event) {
		if (this.transicion == 'in') {
			if (this.estado !== this.estadoInicial)
				setTimeout(
					() =>
						this.dialogRef.close({
							estado: this.estado,
							nombre: this.nombrePedido,
							descripcion: this.numeroOrden
						}),
					350
				);
			return;
		}

		this.actualIcon = this.ICON[this.estado];
		this.transicion = 'in';
	}
}
// 	animations: [
// 		trigger('fade', [
// 			state('in', style({ opacity: '1' })),
// 			state('out', style({ opacity: '0' })),
// 			transition('* <=> *', animate('800ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
// 		])
// 	]
// })
// export class CrearOCConfirmacionDialogComponent {
// 	public estadoInicial: Estado = Estado.Info;
// 	public estado: Estado = Estado.Info;
// 	public mensaje = '';
// 	public titulo = 'Confirmación';
// 	public cancelButtonText = 'Cancelar';
// 	public okButtonText = 'Aceptar';
// 	constructor(
// 		public dialogRef: MatDialogRef<CrearOCConfirmacionDialogComponent>,
// 		@Inject(MAT_DIALOG_DATA) public data: any
// 	) {
// 		this.titulo = data.titulo ? data.titulo : this.titulo;
// 		this.mensaje = data.mensaje ? data.mensaje : this.mensaje;
// 		this.okButtonText = data.okButtonText ? data.okButtonText : this.okButtonText;
// 		this.cancelButtonText = data.cancelButtonText ? data.cancelButtonText : this.cancelButtonText;
// 		this.estadoInicial = data.estadoInicial ? data.estadoInicial : this.estadoInicial;
// 		this.estado = this.estadoInicial;
// 	}

// 	onNoClick(): void {
// 		this.estado = Estado.Decline;
// 	}

// 	onAcceptClick() {
// 		this.estado = Estado.Accept;
// 	}

// 	onAnimationFinish(event) {
// 		if (this.estado !== this.estadoInicial) this.dialogRef.close(this.estado);
// 	}
// }
