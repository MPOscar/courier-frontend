import { Empresa } from '..';

export class Grupo {
	id?: number;
	idEmpresa?: number;
	nombre?: string;
	descripcion?: string;
	empresas?: Empresa[];
	listaEmpresas?: Empresa[];

	constructor(aNombre: string, aDesc: string, listaEmpresas: Empresa[]) {
		this.nombre = aNombre;
		this.descripcion = aDesc;
		this.empresas = listaEmpresas;
	}
}
