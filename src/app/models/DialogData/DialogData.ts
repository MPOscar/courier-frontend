import { TemplateRef } from '@angular/core';

export class DialogData {
	title: string = '';
	content: string = '';
	type: string = ''; // "", "warn", "primary", "accent"
	disabled: boolean = false;
	isSingleButton: boolean = false;
	noButtons: boolean = false;
	cancelButtonText: string = 'Cancelar';
	acceptButtonText: string = 'Aceptar';
	width: string = '350px';
	template: TemplateRef<any> = null;
}
