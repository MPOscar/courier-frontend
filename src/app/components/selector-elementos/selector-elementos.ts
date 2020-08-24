import { Input, Output, EventEmitter } from '@angular/core';

export class SelectorElementos {
	private _selectedElementsIn: any[] = [];
	@Input()
	public get selectedElementsIn(): any[] {
		return this._selectedElementsIn;
	}
	public set selectedElementsIn(value: any[]) {
		this._selectedElementsIn = value;
		this.elementsToOutput = value;
		this.filterAlreadyAddedElements();
	}

	private _allElementsIn: any[] = [];
	@Input()
	public get allElementsIn(): any[] {
		return this._allElementsIn;
	}
	public set allElementsIn(value: any[]) {
		this._allElementsIn = value;
		this.filterAlreadyAddedElements();
	}

	@Output() elementsOut: EventEmitter<any[]> = new EventEmitter<any[]>();

	private elementsToOutput: any[] = [];
	public newElements: any[] = [];

	constructor() {}

	public removeElements(elements: any[]): void {
		if (elements.length > 0) {
			elements.forEach(element => {
				this.removeElement(element);
			});
			this.emitElements();
		}
	}

	public addElements(elements: any[]): void {
		if (elements.length > 0) {
			this._selectedElementsIn = elements;
			elements.forEach(element => {
				this.addElement(element);
			});
			this.emitElements();
		}
	}

	private addElement(element: any): void {
		if (this.elementsToOutput.indexOf(element) === -1) {
			this.elementsToOutput.push(element);
		}
	}

	private removeElement(element: any): void {
		if (this.elementsToOutput.indexOf(element) !== -1) {
			this.elementsToOutput.splice(this.elementsToOutput.indexOf(element), 1);
		}
		this.filterAlreadyAddedElements();
	}

	private emitElements() {
		this.elementsOut.emit(this.elementsToOutput);
	}

	private filterAlreadyAddedElements(): void {
		let filteredElements = this.allElementsIn.filter(x => !this.elementsToOutput.map(x => x.id).includes(x.id));
		this.newElements = filteredElements;
		this.emitElements();
	}
}
