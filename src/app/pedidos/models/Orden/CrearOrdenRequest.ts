import { ProductoOrdenRequest } from './ProductoOrdenRequest';

export class CrearOrdenRequest {
	fechaEntrega = '';
	nroDocumento = '';
	moneda = '';
	comentario = '';
	productos: ProductoOrdenRequest[] = [];
	lugarDeEntrega: String = '';
	lugarDeEntregaDescripcion: String = '';
}
