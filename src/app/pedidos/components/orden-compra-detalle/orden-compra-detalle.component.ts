import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Orden } from 'app/pedidos/models';
import { OC } from 'app/pedidos/models/Edi/OCEDI';
import { OrdenesService } from 'app/pedidos/services';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OCLocalRepresentation {
	gtin: string;
	position: number;
	description: string;
	brand: string;
	cpp: string;
	orderUnit: string;
	cases: string;
	unitPrice: string;
}

@Component({
	selector: 'app-oc-detalle',
	templateUrl: './orden-compra-detalle.component.html',
	styleUrls: ['./orden-compra-detalle.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OCDetalleComponent implements OnInit {
	public ordenEDI = new BehaviorSubject<OC>(null);
	public ordenEDI$ = this.ordenEDI.filter(e => e != null);
	private _orden: Orden;

	displayedColumns: string[] = ['position', 'gtin', 'description', 'brand', 'cpp', 'orderUnit', 'cases', 'unitPrice'];
	dataSource: MatTableDataSource<OCLocalRepresentation> = new MatTableDataSource<OCLocalRepresentation>([]);

	@Input()
	public set orden(orden: Orden) {
		this.obtenerOrden(orden).subscribe(oc => {
			this.ordenEDI.next(oc);
			const oc2List: OCLocalRepresentation[] = [];
			oc.oc2list.forEach(oc2 => {
				const item: OCLocalRepresentation = {
					brand: oc2.itemBrandName,
					cases: oc2.numberOfPackages,
					cpp: oc2.itemIdSellerCode,
					description: oc2.itemDescription,
					gtin: oc2.itemIdGtin,
					orderUnit: oc2.itemAllowanceQuantity,
					position: +oc2.number,
					unitPrice: oc2.netUnitPrice
				};
				oc2List.push(item);
			});
			this.dataSource.data = oc2List;
		});
		this._orden = orden;
	}

	constructor(private ordenesService: OrdenesService, private cd: ChangeDetectorRef) {}

	public get orden(): Orden {
		return this._orden;
	}

	ngOnInit() {}

	descargarOC = (orden, formato) => {
		this.ordenesService.descargarOC(orden, formato);
	};

	obtenerOrden = (orden): Observable<OC> => {
		return this.ordenesService.obtenerOC(orden);
	};
}
