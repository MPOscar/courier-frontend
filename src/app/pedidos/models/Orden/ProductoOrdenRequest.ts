export class ProductoOrdenRequest {
	id?: string;
	gln: string;
	gtin: string;
	cpp: string;
	unidades: number;
	listaVenta: number;
	precio?: number;
}
