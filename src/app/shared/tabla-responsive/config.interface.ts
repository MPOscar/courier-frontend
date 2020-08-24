import { MatTableDataSource } from '@angular/material/table';
import { TemplateRef } from '@angular/core';

export interface ConfigTablaResponsive {
	dataSource: MatTableDataSource<any>;
	displayedColumns: string[];
	columns: Columnas;
	rowClickAction?: Function;
	sortActive?: boolean;
	stickyHeader?: boolean;
}

interface Columnas {
	[id: string]: Columna;
}

interface Columna {
	header?: string;
	width?: string;
	headerAlign?: string;
	cellAlign?: string;
	pipe?: string;
	template?: TemplateRef<any>;
	sort?: boolean;
}
