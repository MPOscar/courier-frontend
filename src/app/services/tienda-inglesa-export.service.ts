import { Injectable } from '@angular/core';
import { IExportService } from './i-export.service';
import { Producto, Pallet } from 'app/models';

@Injectable()
export class TiendaInglesaExportService implements IExportService {
	exportExcel(products: Producto[], provider: string): any {
		var toExport: any = [];
		products.forEach(product => {
			var unidadesPorEmpaque = '';
			var largoEmpaque = '';
			var anchoEmpaque = '';
			var altoEmpaque = '';
			if (product.empaques != null && product.empaques.length > 0) {
				var empaque = product.empaques[0];
				unidadesPorEmpaque = '' + empaque.cantidad;
				largoEmpaque = '' + empaque.profundidad;
				anchoEmpaque = '' + empaque.ancho;
				altoEmpaque = '' + empaque.alto;
			}
			var pallet = new Pallet();
			var altoPallet = '';
			var anchoPallet = '';
			var unidadesPorCamada = '';
			var cantidadDeCamadas = '';
			var profundidadPallet = '';
			if (product.pallet != undefined) {
				pallet = product.pallet;
				altoPallet = '' + pallet.alto;
				anchoPallet = '' + pallet.ancho;
				unidadesPorCamada = '' + pallet.unidadesVenta / pallet.camadas;
				cantidadDeCamadas = '' + pallet.camadas;
				profundidadPallet = '' + pallet.profundidad;
			}

			var productToExport = {
				Comprador: '',
				'Código Tienda Inglesa': '',
				Proveedor: provider,
				'Codigo Proveedor': product.cpp,
				Descripción: product.descripcion,
				Unidad: '', //product.unidadMedida,
				'Código de Barra': product.gtinPresentacion,
				'Unidades por Empaque': unidadesPorEmpaque,
				'Largo Empaque': largoEmpaque,
				'Ancho Empaque': anchoEmpaque,
				'Alto Empaque': altoEmpaque,
				'Peso Unidad': product.pesoBruto / 1000,
				'Largo Pallet (cm)': anchoPallet,
				'Ancho Pallet (cm)': profundidadPallet,
				'Alto Pallet (cm)': altoPallet,
				'Unidades por camada en pallet': unidadesPorCamada,
				'Cantidad de camadas por pallet': cantidadDeCamadas
			};
			toExport.push(productToExport);
		});
		return toExport;
	}

	constructor() {}
}
