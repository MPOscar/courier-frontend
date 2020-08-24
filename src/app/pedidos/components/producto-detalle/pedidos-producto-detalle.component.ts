import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Producto } from 'app/models';
import { AppConfig } from 'app/app.config';

@Component({
	selector: 'app-pedidos-producto',
	templateUrl: './pedidos-producto-detalle.component.html',
	styleUrls: ['./pedidos-producto-detalle.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductoDetalleComponent implements OnInit {
	@Input() producto: Producto;

	constructor(public config: AppConfig) {}

	ngOnInit() {}
}
