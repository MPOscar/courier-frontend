import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	ViewChild,
	ChangeDetectionStrategy,
	ChangeDetectorRef
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { CarritoService } from 'app/pedidos/services';
import { OrdenesService } from 'app/pedidos/services/ordenes.service';
import { ProductoCarrito } from 'app/pedidos/models';
import { Plantilla } from 'app/pedidos/models/Orden/Plantilla';
import { state, style, transition, animate, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/components/confirm-dialog/confirm-dialog.component';

const titleKey = 'Eliminar';

const deleteBtnKey = 'Eliminar';

const messageKey = 'Estas seguro que deseas eliminar esta plantilla?';

@Component({
	selector: 'app-plantillas',
	templateUrl: './plantillas.component.html',
	styleUrls: ['./plantillas.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('estadoCarrito', [
			state(
				'lleno',
				style({
					height: '0px',
					opacity: '0',
					overflow: 'hidden'
				})
			),
			state(
				'vacio',
				style({
					height: '*',
					opacity: '1'
				})
			),
			transition('lleno => vacio', animate('500ms ease-in')),
			transition('vacio => lleno', animate('500ms ease-out'))
		])
	]
})
export class PlantillasComponent implements OnInit {
	private _monedasOrder = ['', 'USD', 'UYU'];

	private _monedas = {};

	planillaId: String = '0';

	@ViewChild('tabGroupProductos') tabProductos: MatTabGroup;

	@Output() plantillaToggled = new EventEmitter();

	@Output() ocultarPlantillaEventEmmitter = new EventEmitter();

	@Output() plantillaSeleccionada = new EventEmitter();

	modalRef: MatDialogRef<ConfirmDialogComponent>;

	public plantillaDataSource: MatTableDataSource<Plantilla> = new MatTableDataSource();

	public plantillaDisplayedColumns = ['descripcion', 'fecha', 'actions'];

	constructor(
		private cd: ChangeDetectorRef,
		private carritoService: CarritoService,
		private ordenesService: OrdenesService,
		private dialog: MatDialog
	) {}

	ngOnInit() {
		this.obtenerPlantillas();
	}

	obtenerPlantillas() {
		this.ordenesService.obtenerTodasLasPlantillas().subscribe(response => {
			this.plantillaDataSource.data = response.data;
		});
	}

	togglePlantilla(toggle) {
		this.plantillaToggled.emit(toggle);
	}

	ocultarPlantilla(toggle) {
		this.ocultarPlantillaEventEmmitter.emit(toggle);
	}

	changeSeleccion(event) {
		this.planillaId = event.value;
	}

	seleccionarPlantilla() {
		this.plantillaSeleccionada.emit(this.planillaId);
		this.togglePlantilla(false);
	}

	delete(data) {
		this.modalRef = this.dialog.open(ConfirmDialogComponent, {
			data: {
				titleKey: titleKey,
				okBtnKey: deleteBtnKey,
				messageKey: messageKey,
				messageParam: { param: data }
			}
		});

		this.modalRef.afterClosed().subscribe(result => {
			if (result) {
				this.ordenesService.eliminarPlantilla(data).subscribe(response => {
					this.obtenerPlantillas();
				});
			}
		});
	}
}
