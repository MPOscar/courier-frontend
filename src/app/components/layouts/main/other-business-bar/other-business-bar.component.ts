import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmpresasService } from 'app/services';

@Component({
	selector: 'other-business-bar',
	templateUrl: './other-business-bar.component.html',
	styleUrls: ['./other-business-bar.component.scss']
})
export class OtherBusinessBarComponent implements OnInit {
	selectedAdministration: boolean;
	selectedProviders: boolean;
	selectedWishlist: boolean;
	selectedProducts: boolean;

	currentProvider: string;
	haveCurrentProvider: boolean;
	userName: string;

	@ViewChild('toolbarSearchInput', { static: true }) inputEl: ElementRef;

	constructor(public _businessService: EmpresasService, private router: Router) {
		this.haveCurrentProvider = false;
		this.selectedAdministration = false;
		_businessService.isOnProviders = true;
		_businessService.isOnExport = false;
		_businessService.isOnSaleList = false;
		this._businessService.isOnProducts = false;

		this._businessService.dataChange.subscribe(showProvider => {
			if (showProvider) {
				this.haveCurrentProvider = true;
				this.currentProvider = localStorage.getItem('currentProvider');
			} else {
				this.haveCurrentProvider = false;
				this.currentProvider = '';
			}
		});

		if (localStorage.getItem('currentProvider') && localStorage.getItem('currentProvider') != '') {
			this.haveCurrentProvider = true;
			this.currentProvider = localStorage.getItem('currentProvider');
		} else {
			this.haveCurrentProvider = false;
		}
	}

	ngOnInit() {
		this.userName =
			JSON.parse(localStorage.getItem('user')).nombre + ' ' + JSON.parse(localStorage.getItem('user')).apellido;
	}

	goToProviderList(): void {
		this._businessService.isOnProviders = true;
		this.selectedAdministration = false;
		this._businessService.isOnExport = false;
		this._businessService.isOnProducts = false;
		this._businessService.isOnSaleList = false;
		this.router.navigate(['/lista-proveedores']);
	}

	goToProducts() {
		this._businessService.isOnProviders = false;
		this.selectedAdministration = false;
		this._businessService.isOnExport = false;
		this._businessService.isOnProducts = true;
		this._businessService.isOnSaleList = false;
		var provider = this._businessService.currentProvider;
		if (provider == undefined || provider == '') {
			if (localStorage.getItem('currentProviderId')) {
				provider = localStorage.getItem('currentProviderId');
			} else {
				provider = '' + 0;
			}
		}
		return ['/catalogo-proveedor', provider]; //falta setear titulo
	}

	goToAdministration(): void {
		this._businessService.isOnProviders = false;
		this._businessService.isOnProviders = true;
		this._businessService.isOnExport = false;
		this._businessService.isOnProducts = false;
		this._businessService.isOnSaleList = false;
		this.router.navigate(['/admin-cliente']);
	}

	goToWishlist() {
		this._businessService.isOnProviders = false;
		this.selectedAdministration = false;
		this._businessService.isOnExport = true;
		this._businessService.isOnProducts = false;
		var provider = this._businessService.currentProvider;
		this._businessService.isOnSaleList = false;
		if (this._businessService.currentProvider == undefined || this._businessService.currentProvider == '')
			provider = '' + 0;
		return ['/lista-exportacion-proveedor', provider];
	}

	goToSaleList() {
		this._businessService.isOnProviders = false;
		this.selectedAdministration = false;
		this._businessService.isOnExport = false;
		this._businessService.isOnProducts = false;
		var provider = this._businessService.currentProvider;
		this._businessService.isOnSaleList = true;
		if (this._businessService.currentProvider == undefined || this._businessService.currentProvider == '')
			provider = '' + 0;
		return ['/lista-venta-ajena', provider];
	}
}
