import { Injectable } from '@angular/core';
import { Producto } from 'app/models';

@Injectable()
export abstract class IExportService {
	abstract exportExcel(products: Producto[], provider: string): any;
}
