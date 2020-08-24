import { Filtro } from 'app/models';

export class TipoFiltro {
	nombre: string;
	collapsed?: boolean;
	filtros?: Filtro[] = [];
	checked?: boolean;
}
