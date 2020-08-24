import { Injectable } from '@angular/core';
import { IExportService, ExcelService } from './index';
import { Producto } from 'app/models';

@Injectable()
export class ExportService {
	private currentStrategy: IExportService;
	constructor(private excelService: ExcelService) {}

	public setStrategy(strategy: IExportService) {
		this.currentStrategy = strategy;
	}

	public performStrategy(products: Producto[], provider: string, fileName: string) {
		var toExport = this.currentStrategy.exportExcel(products, provider);
		this.excelService.exportAsExcelFile(toExport, fileName);
	}
}
