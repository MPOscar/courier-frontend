import { Producto } from '..';
import { Grupo } from '../Grupo/Grupo';
import { Empresa } from '../Empresa/Empresa';

export class VisibilityRequest {
	esPublico?: boolean;
	esPrivado?: boolean;
	productos?: Producto[];
	grupos?: Grupo[];
	empresas?: Empresa[];
	addVisibility?: boolean;
	isMasive?: boolean;
}
