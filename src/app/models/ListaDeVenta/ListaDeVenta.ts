import { Empresa, Grupo } from '..';
import { Producto } from '..';

export class ListaDeVenta {
	id?: number;
	idEmpresa?: number;
	nombre?: string;
	descripcion?: string;
	empresas?: Empresa[];
	listaEmpresas?: Empresa[];
	productos?: Producto[];
	grupos?: Grupo[];
	listaGrupos?: Grupo[];
	listaProductos?: Producto[];
	ubicacion?: Object;

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

	setId(id) {
		this.id = id;
	}
}

export class ListaDeVentaBasic {
	id?: number;
	nombre?: string;
	descripcion?: string;
	ubicacion?: Object;

	constructor(aNombre: string, aDesc: string) {
		this.nombre = aNombre;
		this.descripcion = aDesc;
	}

	setId(id) {
		this.id = id;
	}
}
