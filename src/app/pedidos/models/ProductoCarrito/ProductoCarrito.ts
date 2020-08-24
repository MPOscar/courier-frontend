import { Producto, ListaDeVenta } from 'app/models';

export class ProductoCarrito extends Producto {
	cantidad?: number;
	unidades?: number;
	gtinOC?: string;
	listaVenta?: ListaDeVenta;
	moneda?: string;
}
