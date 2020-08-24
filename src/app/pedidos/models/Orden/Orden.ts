import { Proveedor, ProductoCarrito } from 'app/pedidos/models';

export class Orden {
	fecha_envio?: Date | string;
	de?: String;
	deGLN?: String;
	deRazonSocial: string;
	paraGLN: string;
	paraRazonSocial: string;
	idProveedor?: number;
	proveedor?: Proveedor;
	nroOrden: string;
	estado: string;
	draft?: boolean;
	fechaEstado: string;
	orden = '';
	productosCarrito?: ProductoCarrito[];
	tipoDocumento: string;
	mensaje: string;
	info: string;
	deFecha: string;
	id: number;
	idPrior: number;
}
