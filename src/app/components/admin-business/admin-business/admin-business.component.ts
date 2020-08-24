import { Component, OnInit } from '@angular/core';
import { EmpresasService } from '../../../services/empresas.service';

@Component({
	selector: 'app-admin-business',
	templateUrl: './admin-business.component.html',
	styleUrls: ['./admin-business.component.scss']
})
export class AdminBusinessComponent implements OnInit {
	showCreate: Boolean = true;
	showList: Boolean = false;

	constructor(public businessService: EmpresasService) {}

	ngOnInit() {
		this.cargarEmpresas();
	}

	cargarEmpresas() {
		this.businessService.getBusinesses().subscribe(empresas => {
			this.businessService.businessesDatabase.updateBusinesses(empresas);
		});
	}

	showCreateBusiness() {
		this.showCreate = true;
		this.showList = false;
	}

	showListBusinesses() {
		this.showCreate = false;
		this.showList = true;
		this.businessService.showModifyBusiness = false;
	}
}
