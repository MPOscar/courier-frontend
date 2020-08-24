import { Usuario } from '../Usuario/Usuario';
import { Baja } from '../Baja/Baja';

export class Empresa {
	id?: number;
	nombre?: string;
	gln?: string;
	foto?: string;
	razonSocial?: string;
	nuevaBaja?: Baja;
	bajas?: Baja[];
	rut?: string;
	// proveedor?: boolean;
	validado?: boolean;
	activo?: boolean;
	fechaCreacion?: String;
	fechaEdicion?: String;
	//creador?:number;
	empleado?: Usuario;
	wishlistSize?: number;
	email?: string;
	_links?: any;
	_filters?: any;
	paraMostrar?: boolean;
}
