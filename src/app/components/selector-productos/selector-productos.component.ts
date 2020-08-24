import { Component } from '@angular/core';
import { SelectorElementos } from '../selector-elementos/selector-elementos';

@Component({
	selector: 'app-selector-productos',
	templateUrl: './selector-productos.component.html',
	styleUrls: ['./selector-productos.component.scss']
})
export class SelectorProductosComponent extends SelectorElementos {
	constructor() {
		super();
	}
}
