import { Empresa, Producto } from '../';
import { Grupo } from '../Grupo/Grupo';

export class ListaVenta {
	id?: number;
	idEmpresa?: number;
	nombre?: string;
	descripcion?: string;
	empresas?: Empresa[];
	grupos?: Grupo[];
	productos?: Producto[];

	constructor(
		aNombre: string,
		aDesc: string,
		listaEmpresas: Empresa[],
		listaProductos: Producto[],
		listaGrupos: Grupo[]
	) {
		this.nombre = aNombre;
		this.descripcion = aDesc;
		this.empresas = listaEmpresas;
		this.productos = listaProductos;
		this.grupos = listaGrupos;
	}
}
