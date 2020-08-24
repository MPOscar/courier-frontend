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
	selector: 'info-dialog',
	templateUrl: 'info-dialog.component.html',
	styleUrls: ['info-dialog.component.scss'],
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
export class InfoDialogComponent {
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

	constructor(public dialogRef: MatDialogRef<InfoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
		this.titulo = data.titulo ? data.titulo : this.titulo;
		this.mensaje = data.mensaje ? data.mensaje : this.mensaje;
	}
	onNoClick(): void {
		this.estado = Estado.Decline;
		this.disableActions = true;
		this.transicion = 'out';
	}

	onAcceptClick() {
		this.dialogRef.close();
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
