import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProveedoresService } from 'app/pedidos/services';
import { Proveedor } from 'app/pedidos/models';
import { tap, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-proveedores',
	templateUrl: 'proveedores.component.html',
	styleUrls: ['proveedores.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProveedoresComponent implements OnInit, OnDestroy {
	/**
	 * Observable utilizado para controlar cuando se debe llamar el método
	 * unsubscribe en las Subscripciones generadas en el Componente.
	 * También puede ser utilizado para el operador takeUntil() (Recomendado para no tener que guardar las
	 * subscripciones )
	 *
	 * @private
	 * @memberof ProductosComponent
	 */
	private componenteDestruido$ = new Subject<void>();

	public proveedores: Proveedor[];
	public mostrarIndicadorCargando = false;
	private tareasOcupadas = {};

	constructor(
		private router: Router,
		private cd: ChangeDetectorRef,
		private proveedoresService: ProveedoresService
	) {}

	ngOnDestroy() {
		this.componenteDestruido$.next();
		this.componenteDestruido$.complete();
	}

	ngOnInit() {
		this.mostrarLoader('proveedores', true);
		this.proveedoresService
			.updateProveedores()
			.takeUntil(this.componenteDestruido$)
			.pipe(tap(e => (this.proveedores = [])))
			.skip(1)
			.subscribe(
				(proveedores: Proveedor[]) => (
					(this.proveedores = proveedores), this.mostrarLoader('proveedores', false), this.cd.markForCheck()
				)
			);
	}

	private mostrarLoader(tarea: string, mostrar: boolean) {
		if (isNaN(this.tareasOcupadas[tarea])) this.tareasOcupadas[tarea] = 0;
		this.tareasOcupadas[tarea] = mostrar ? ++this.tareasOcupadas[tarea] : --this.tareasOcupadas[tarea];
		if (this.tareasOcupadas[tarea] < 0) {
			this.tareasOcupadas[tarea] = 0;
		}
		let existeTarea = false;
		for (const item of Object.values(this.tareasOcupadas)) {
			existeTarea = existeTarea || (item as number) > 0;
		}
		this.mostrarIndicadorCargando = existeTarea;
	}

	public goTo(route) {
		this.router.navigate(route);
	}
}
