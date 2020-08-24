import { Producto } from '..';

export class Categoria {
	id?: number;
	nombre?: string;
	descripcion?: string;
	posicion?: number;
	nivel?: number;
	padre?: Categoria;
	productos?: Producto[];
	_links?: Array<any>;

	constructor(aNombre: string) {
		this.nombre = aNombre;
	}
}
