import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-producto-pallet',
	templateUrl: './producto-pallet.component.html',
	styleUrls: ['./producto-pallet.component.scss', '../producto/producto.component.scss']
})
export class ProductoPalletComponent implements OnInit {
	@Input() palletFormIn: FormGroup;
	@Input() isEmpty: boolean;

	constructor() {}

	ngOnInit() {}

	get f() {
		return this.palletFormIn.controls;
	}
}
