import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EmpresasService } from '../../../services';
import { Empresa } from '../../../models';
import { Router } from '@angular/router';

@Component({
	selector: 'provider-list',
	templateUrl: './provider-list.component.html',
	styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit {
	providers: Empresa[] = [];
	@Output() onSelect = new EventEmitter<boolean>();
	selectedValue: Empresa;

	constructor(private _businessService: EmpresasService, private _router: Router) {}

	ngOnInit() {
		this._businessService.getEmpresasCatalogo().subscribe(response => {
			this.providers = response.data;
		});
		if (!localStorage.getItem('currentProvider')) {
			localStorage.setItem('currentProvider', '');
		}
	}

	goToProvider() {
		if (this.selectedValue != undefined) {
			this._businessService.currentProvider = this.selectedValue.id.toString();
			this._businessService.isOnProducts = true;
			this._businessService.isOnExport = false;
			this._businessService.isOnProviders = false;
			this.providers.forEach(element => {
				if (element.id == this.selectedValue.id) this._businessService.currentProviderName = element.nombre;
			});
			localStorage.setItem('currentProvider', this.selectedValue.nombre);
			localStorage.setItem('currentProviderId', this.selectedValue.id.toString());
			this._businessService.dataChange.emit(true);
			this._router.navigate(['/catalogo-proveedor', this.selectedValue.id.toString()]);
		}
	}
}
