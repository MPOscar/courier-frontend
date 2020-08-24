import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { ConfigTablaResponsive } from './config.interface';
import { MatSort } from '@angular/material/sort';

@Component({
	selector: 'app-tabla-responsive',
	templateUrl: 'tabla-responsive.component.html',
	styleUrls: ['tabla-responsive.component.scss']
})
export class TablaResponsiveComponent implements OnInit {
	@Input() esTabla = true;
	@Input() tempTabla: TemplateRef<any>;
	@Input() tempTablaLista: TemplateRef<any>;
	@Input() config: ConfigTablaResponsive;

	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor() {}
	ngOnInit() {
		if (this.config) {
			this.config.dataSource.sort = this.sort;
		}
	}
}
