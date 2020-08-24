import { of as observableOf, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Pipe, PipeTransform } from '@angular/core';
import { PresentacionesService } from 'app/services';
import { Presentacion } from 'app/models';
/**
 * Este Pipe está implementado para abstraer el Componente donde se utilice de la forma en la que llega
 * el valor del Campo Presentacion en el Producto.
 * Una vez estable el Catalogo pudiera eliminarse y se asumiría que siempre llega
 * un objeto correcto de tipo Presentacion.
 *
 * @export
 * @class PresentacionPipe
 * @implements {PipeTransform}
 */
@Pipe({
	name: 'presentacion',
	pure: true
})
export class PresentacionPipe implements PipeTransform {
	constructor(private presentacionesService: PresentacionesService) {}

	transform(value: any, args?: any): any {
		if (typeof value === 'string' || value === undefined || value === null) {
			return observableOf({ nombre: '-' });
		}

		return this.presentacionesService.getPresentaciones().pipe(
			map(presentaciones => {
				const item: Presentacion = presentaciones.find(presentacion => presentacion.nombre == value.nombre);
				return typeof item === 'string' || item === undefined || item === null ? { nombre: '-' } : item;
			})
		);
	}
}
