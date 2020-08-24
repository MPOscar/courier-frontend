import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Presentacion } from 'app/models';
import { CountryService } from 'app/services/country.service';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'app-producto-info',
	templateUrl: './producto-info.component.html',
	styleUrls: ['./producto-info.component.scss', '../producto/producto.component.scss']
})
export class ProductoInfoComponent implements OnInit {
	@Input() presentaciones: Presentacion[];
	@Input() productoFormIn: FormGroup;
  @Input() disable = true;
	@Input() imgURLIn: BehaviorSubject<string>;
	@Output() imageOut: EventEmitter<any> = new EventEmitter<any>();

	countries;
	measurementUnits: String[] = ['EA', 'kg', 'gr', 'cc', 'm3', 'lb', 'ml'];
	weightUnits: String[] = ['kg', 'gr', 'lb'];

	constructor(private countryService: CountryService) {
		this.countries = countryService.getCountryList();
	}

	ngOnInit() {}

	get f() {
		return this.productoFormIn.controls;
	}

	handleImageChangeEvent(image: any) {
		this.imageOut.emit(image);
	}

	presentationCompare(o1: any, o2: any): boolean {
		if (o1 === null || o2 === null) return false;
		return o1.nombre === o2.nombre;
	}
}
