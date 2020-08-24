import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-producto-empaques',
	templateUrl: './producto-empaques.component.html',
	styleUrls: ['./producto-empaques.component.scss', '../producto/producto.component.scss']
})
export class ProductoEmpaquesComponent implements OnInit {
	@Input() empaquesFormIn: FormArray;
	@Input() emptyEmpaqueForm: FormGroup;
	@Input() isEmpty: boolean;

	weightUnits: String[] = ['kg', 'gr', 'lb'];
	packClasificationTypes: String[] = ['Display', 'Inner Pack', 'Caja'];

	constructor() {}

	ngOnInit() {}

	f(pos: number) {
		let tempEmp: FormGroup = this.empaquesFormIn.at(pos) as FormGroup;
		return tempEmp.controls;
	}

	addEmpaque(): void {
		this.emptyEmpaqueForm.controls['nivel'].setValue(this.empaquesFormIn.length + 1);
		this.empaquesFormIn.push(this.emptyEmpaqueForm);
	}

	eliminarEmpaque(pos: number): void {
		this.empaquesFormIn.removeAt(pos);
		this.resetearNiveles();
	}

	resetearNiveles() {
		for (let i = 0; i < this.empaquesFormIn.length; i++) {
			let tempEmp: FormGroup = this.empaquesFormIn.at(i) as FormGroup;
			tempEmp.controls['nivel'].setValue(i + 1);
		}
	}

	cantidadVentaTooltip(nivel: number): String {
		if (nivel == 0) {
			return 'Cantidad por empaque de la unidad de venta';
		} else {
			return 'Cantidad por empaque del nivel anterior';
		}
	}

	cantidadVentaPlaceholder(nivel: number): String {
		if (nivel == 0) {
			return 'Cantidad por unidad de venta';
		} else {
			return 'Cantidad por nivel anterior';
		}
	}
}
