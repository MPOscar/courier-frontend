import { Component } from '@angular/core';
import { SelectorElementos } from '../selector-elementos/selector-elementos';

@Component({
	selector: 'app-selector-empresas',
	templateUrl: './selector-empresas.component.html',
	styleUrls: ['./selector-empresas.component.scss']
})
export class SelectorEmpresasComponent extends SelectorElementos {
	constructor() {
		super();
	}
}
