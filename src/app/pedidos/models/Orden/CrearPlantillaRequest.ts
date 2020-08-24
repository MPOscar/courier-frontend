import { ProductoOrdenRequest } from './ProductoOrdenRequest';

export class CrearPlantillaRequest {
	nombre: string = '';

	descripcion: string = '';

	empresa?: number = 0;

	usuarioEmpresaId?: number = 0;

	finalizado: boolean = false;

	productos: ProductoOrdenRequest[] = [];
}
