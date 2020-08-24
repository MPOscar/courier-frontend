import { Injectable } from '@angular/core';
import { IExportService } from './i-export.service';
import { Producto, Empaque, Pallet, Presentacion } from 'app/models';

@Injectable()
export class TataExportService implements IExportService {
	exportExcel(products: Producto[], provider: string): any {
		var toExport: any = [];
		products.forEach(product => {
			if (product.categoria != null) {
				product.division = product.categoria.nombre;
				if (product.categoria.padre != null) {
					product.linea = product.categoria.padre.nombre;
				}
			}
			var unidadesPorEmpaque = '';
			var largoEmpaque = '';
			var anchoEmpaque = '';
			var altoEmpaque = '';
			var empaque = new Empaque();
			var empaquePadre = new Empaque();
			var empaqueCaja = new Empaque();
			if (product.empaques != null && product.empaques.length > 0) {
				empaque = product.empaques[0];
				unidadesPorEmpaque = '' + empaque.cantidad;
				largoEmpaque = '' + empaque.profundidad;
				anchoEmpaque = '' + empaque.ancho;
				altoEmpaque = '' + empaque.alto;
				if (empaque.padre != null) {
					empaquePadre = empaque.padre;
					if (empaquePadre.padre != null) empaqueCaja = empaquePadre.padre;
				}
			}

			var pallet = new Pallet();
			var altoPallet = '';
			var anchoPallet = '';
			var camadaPallet = '';
			var cajaPallet = '';
			var unidadPallet = '';
			var profundidadPallet = '';
			if (product.pallet != undefined) {
				pallet = product.pallet;
				altoPallet = '' + pallet.alto;
				anchoPallet = '' + pallet.ancho;
				camadaPallet = '' + pallet.camadas;
				cajaPallet = '' + pallet.cajas;
				unidadPallet = '' + pallet.unidadesVenta;
				profundidadPallet = '' + pallet.profundidad;
			}

			var presentacionEmpaque = new Presentacion();
			var presentacionEmpaquePadre = new Presentacion();
			var presentacionEmpaqueCaja = new Presentacion();

			if (empaque.presentacion != undefined) {
				presentacionEmpaque = empaque.presentacion;
			}

			if (empaquePadre.presentacion != undefined) {
				presentacionEmpaquePadre = empaquePadre.presentacion;
			}

			if (empaqueCaja.presentacion != undefined) {
				presentacionEmpaqueCaja = empaqueCaja.presentacion;
			}

			var productToExport = {
				'CPP (SKU)': product.cpp,
				GTIN: product.gtinPresentacion,
				'País de origen': product.paisOrigen,
				Descripción: product.descripcion,
				'Mercado Objetivo': product.mercadoObjetivo,
				Marca: product.marca,
				'Categoría Principal (División)': product.division,
				'Categoría Secundaria (Línea o Familia)': product.linea,
				Presentacion:
					product.presentacion != null && typeof product.presentacion !== 'string'
						? product.presentacion.nombre
						: '',
				'Contenido Neto': product.contenidoNeto,
				'Unidad de Medida Contenido Neto': product.unidadMedida,
				'Peso Bruto': product.pesoBruto,
				'Unidad de Medida Peso Bruto': product.unidadMedidaPesoBruto,
				Alto: product.alto,
				Ancho: product.ancho,
				Profundidad: product.profundidad,
				'Se venden unidades de consumo de a': product.nivelMinimoVenta,
				'CPP (SKU) Empaque': empaque.cpp,
				'GTIN Empaque': empaque.gtin,
				'Descripción Empaque': empaque.descripcion,
				'Presentación Empaque': presentacionEmpaque,
				'Peso Bruto Empaque': empaque.pesoBruto,
				'Unidad de medida Peso Bruto Empaque': empaque.unidadMedida,
				'Alto Empaque': altoEmpaque,
				'Ancho Empaque': anchoEmpaque,
				'Profundidad Empaque': largoEmpaque,
				'Cantidad contenida Empaque': empaque.cantidad,
				'CPP (SKU) Empaque Padre': empaquePadre.cpp,
				'GTIN Empaque Padre': empaquePadre.gtin,
				'Descripción Empaque Padre': empaquePadre.descripcion,
				'Presentación Empaque Padre': presentacionEmpaquePadre,
				'Peso Bruto Empaque Padre': empaquePadre.pesoBruto,
				'Unidad de medida Peso Bruto Empaque Padre': empaquePadre.unidadMedida,
				'Alto Empaque Padre': empaquePadre.alto,
				'Ancho Empaque Padre': empaquePadre.ancho,
				'Profundidad Empaque Padre': empaquePadre.profundidad,
				'Cantidad contenida Empaque Padre': empaquePadre.cantidad,
				'CPP (SKU) Empaque Caja': empaqueCaja.cpp,
				'GTIN Empaque Caja': empaqueCaja.gtin,
				'Descripción Empaque Caja': empaqueCaja.descripcion,
				'Presentación Empaque Caja': presentacionEmpaqueCaja,
				'Peso Bruto Empaque Caja': empaqueCaja.pesoBruto,
				'Unidad de medida Peso Bruto Empaque Caja': empaqueCaja.unidadMedida,
				'Alto Empaque Caja': empaqueCaja.alto,
				'Ancho Empaque Caja': empaqueCaja.ancho,
				'Profundidad Empaque Caja': empaqueCaja.profundidad,
				'Cantidad contenida Empaque Caja': empaqueCaja.cantidad,
				'Largo Pallet': anchoPallet,
				'Ancho Pallet': profundidadPallet,
				'Alto Pallet': altoPallet,
				'Unidad de Venta / Pallet': unidadPallet,
				'Cajas / Pallet': cajaPallet,
				'Nº Camadas / Pallet': camadaPallet
			};
			toExport.push(productToExport);
		});
		return toExport;
	}

	constructor() {}
}
