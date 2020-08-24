import { Rol } from '../Rol/Rol';

export class Usuario {
	id?: number;
	nombre?: string;
	apellido?: string;
	email?: string;
	usuario?: string;
	contrasena?: string;
	reseteoContrasena?: boolean;
	validado?: boolean;
	validadoParaEmpresa?: boolean;
	esAdministradorSistema?: boolean;
	activo?: boolean;
	roles?: Rol[];
	_links?: any;
	_filters?: any;
}
