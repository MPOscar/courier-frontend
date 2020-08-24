import { Presentacion } from '../Presentacion/Presentacion';
export class Empaque {
	id?: number;
	gtin?: number;
	cpp?: string;
	nivel?: number;
	descripcion?: string;
	presentacion?: Presentacion;
	cantidad?: number;
	cantidadMinima?: number;
	padre?: Empaque;
	pesoBruto?: number;
	unidadMedida?: string;
	alto?: number;
	ancho?: number;
	profundidad?: number;
	clasificacion?: string;
	_links?: Array<any>;
}
