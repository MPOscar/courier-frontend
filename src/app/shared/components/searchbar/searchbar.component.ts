import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
	selector: 'app-searchbar',
	templateUrl: './searchbar.component.html',
	styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
	public selectedFilters: string[] = [];
	public separatorKeysCodes = [ENTER];

	@Output() filtersOut: EventEmitter<string[]> = new EventEmitter<string[]>();

	constructor() {}

	ngOnInit(): void {}

	public removeFilter(filter): void {
		this.selectedFilters.splice(this.selectedFilters.indexOf(filter), 1);
		this.emitFilters();
	}

	public addFiltro(event: MatChipInputEvent): void {
		let input = event.input;
		let value = event.value;
		if (value.trim() != '') {
			if ((value || '').trim()) {
				this.selectedFilters.push(value.trim());
				this.emitFilters();
			}

			if (input) {
				input.value = '';
			}
		}
	}

	private emitFilters(): void {
		this.filtersOut.emit(this.selectedFilters);
	}
}
