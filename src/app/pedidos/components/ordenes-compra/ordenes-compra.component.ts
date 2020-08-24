import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	ChangeDetectionStrategy,
	OnDestroy,
	HostListener
} from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ENTER } from '@angular/cdk/keycodes';
import { Utils } from 'app/utils/Utils';

import { Orden, Proveedor } from 'app/pedidos/models';
import { ProveedoresService, OrdenesService } from 'app/pedidos/services';
import { trigger, state, animate, transition, style } from '@angular/animations';
import { SidenavService } from 'app/shared/services/sidenav.service';

@Component({
	selector: 'app-ordenes-compra',
	templateUrl: 'ordenes-compra.component.html',
	styleUrls: ['ordenes-compra.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0px', visibility: 'hidden' })),
			state('expanded', style({ height: '*', visibility: 'visible' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
		])
	]
})
export class OrdenesCompraComponent implements OnInit {
	private _filtrosActivos = new BehaviorSubject([]);

	public dataSource: MatTableDataSource<Orden> = new MatTableDataSource([]);
	public startDateFilter = new FormControl(new Date());
	public endDateFilter = new FormControl(new Date());
	public ordenSeleccionada: Orden;
	public mostrarIndicadorCargando = false;
	public tipoOrden = 'Todas';
	screenWidth;

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild('filter', { static: true }) filter: ElementRef;

	public displayedColumns: string[] = ['fecha_envio', 'de', 'para', 'numero', 'status', 'abrir'];
	public separatorKeysCodes = [ENTER];

	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
		if (this.screenWidth < 960) {
			this.displayedColumns = ['fecha_envio', 'de', 'para', 'numero', 'abrir'];
		} else {
			this.displayedColumns = ['fecha_envio', 'de', 'para', 'numero', 'status', 'abrir'];
		}
	}

	constructor(private proveedoresService: ProveedoresService, private ordenesService: OrdenesService) {}

	ngOnInit() {
		this.ordenesService.getOrdenes().subscribe(ordenes => this.cargarOrdenes(ordenes));

		this.dataSource.sort = this.sort;
		this.dataSource.filterPredicate = this.ordenesFilterPredicate;

		this.dataSource.paginator = this.paginator;
		this.dataSource.paginator._intl.itemsPerPageLabel = 'Por página';
		this.dataSource.paginator._intl.getRangeLabel = (page, size, length) =>
			`${page * size + 1} a ${page * size + size > length ? length : page * size + size} de ${length}`;
		this.endDateFilter.valueChanges.subscribe(_ => this.dateFilterChanged());
		this.startDateFilter.valueChanges.subscribe(_ => this.dateFilterChanged());
		this.dateFilterChanged();
		this.onResize();
	}

	addFilterTipoOrden(value: string) {
		value = '' + value;

		if (value.trim() === '') {
			this.removeFilter('RECIBIDA');
			this.removeFilter('EMITIDA');
		}

		this.filtrosActivos = [...this.filtrosActivos, value.trim()];

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	addFilter(event: MatChipInputEvent): void {
		const value = event.value;

		if (!value) return;

		this.filtrosActivos = [...this.filtrosActivos, value.trim()];
		event.input.value = '';

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	removeFilter(removedFilter: string) {
		this.filtrosActivos = this.filtrosActivos.filter(filter => filter != removedFilter);
	}

	cargarOrdenes(ordenes: Orden[]) {
		this.dataSource.data = ordenes;
		if (ordenes.length) {
			ordenes.forEach(orden => (orden.fecha_envio = new Date(orden.fecha_envio)));
			this.proveedoresService.getProveedores().subscribe(proveedores => this.cargarProveedores(proveedores));
		}
	}

	cargarProveedores(proveedores: Proveedor[]) {
		this.dataSource.data.forEach(
			orden => (orden.proveedor = proveedores.find(proveedor => proveedor.id == orden.proveedor))
		);
	}

	ordenesFilterPredicate = (data: Orden, filter: string): boolean => {
		const text = '' + data.deGLN + data.deRazonSocial + data.paraGLN + data.paraRazonSocial + data.nroOrden;
		const search = Utils.normalizarStr(text);

		let filters = filter.split('|');

		filters = filters.filter(e => !/(desde|hasta):/g.test(e));
		return filters.every(filter => search.includes(filter));
	};

	dateFilterChanged() {
		const startDate: Date = this.startDateFilter.value;
		const endDate: Date = this.endDateFilter.value;
		if (startDate.getTime() > endDate.getTime()) {
			this.endDateFilter.setValue(startDate);
			this.endDateFilter.updateValueAndValidity();
			return;
		}

		Observable.of(null)
			.do(e => {
				this.mostrarIndicadorCargando = true;
			})
			.switchMap(e => this.ordenesService.filtrarOrdenes(startDate, endDate))
			.subscribe(
				success => {
					this.mostrarIndicadorCargando = false;
					if (this.dataSource.paginator) {
						this.dataSource.paginator.firstPage();
					}
				},
				error => (this.mostrarIndicadorCargando = false)
			);
	}

	set filtrosActivos(value) {
		value = value.map(Utils.normalizarStr);
		this.dataSource.filter = value.join('|');
		this._filtrosActivos.next(value);
	}

	get filtrosActivos() {
		return this._filtrosActivos.value;
	}

	descargarOC = (orden, formato) => {
		this.ordenesService.descargarOC(orden, formato);
	};

	ordenar(sortLocal: Sort) {
		const data = this.dataSource.data.slice();
		if (!sortLocal.active || sortLocal.direction === '') {
			return;
		}

		this.dataSource.data = data.sort((a, b) => {
			const fechaA = new Date(a.fechaEstado);
			const fechaB = new Date(b.fechaEstado);
			const isAsc = this.sort.direction === 'asc';
			switch (sortLocal.active) {
				case 'fecha_envio':
					return this.compare(fechaA.getTime(), fechaB.getTime(), isAsc);
				default:
					return 0;
			}
		});
	}

	compare(a: number | string, b: number | string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	}

	public getAsSafariCompatibleDate(fechaEstado: string) {
		let fecha = fechaEstado.replace(/\s/g, 'T');
		return fecha;
	}
}
