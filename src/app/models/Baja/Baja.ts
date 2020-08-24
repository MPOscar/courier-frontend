import { Empresa, Usuario } from '..';

export class Baja {
	id?: number;
	motivo?: string;
	empresa?: Empresa;
	admin?: Usuario;
	fechaCreacion?: String;
	fechaEdicion?: String;
	fecha;

	constructor() {}
}
