import { Component, OnInit } from '@angular/core';
import { EmpresasService } from '../../../services/empresas.service';
import { Empresa } from '../../../models';
import { Router } from '@angular/router';

@Component({
	selector: 'app-edit-businesses',
	templateUrl: './edit-businesses.component.html',
	styleUrls: ['./edit-businesses.component.scss']
})
export class EditBusinessesComponent implements OnInit {
	supermarkets: Empresa[];

	constructor(private _empresasService: EmpresasService, private _router: Router) {}

	ngOnInit() {
		this.cargarEmpresas();
		this._empresasService.dataChange.subscribe(changed => {
			if (changed) {
				this.supermarkets = this._empresasService.businessesDatabase.data;
			}
		});
	}

	cargarEmpresas() {
		this._empresasService.getBusinesses().subscribe(empresas => {
			this._empresasService.businessesDatabase.updateBusinesses(empresas);
			this.supermarkets = this._empresasService.businessesDatabase.data;
		});
	}

	showSupermarket(supermercado) {
		this._router.navigate(['/editar-empresa', supermercado.id]);
	}
}
