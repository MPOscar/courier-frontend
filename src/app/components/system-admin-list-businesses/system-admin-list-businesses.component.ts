import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { BusinessesDataSource, BusinessesDatabase } from 'app/data-sources';
import { Empresa } from 'app/models';
import { ENTER } from '@angular/cdk/keycodes';
import { AlertService, AuthenticationService, EmpresasService } from 'app/services';

@Component({
	selector: 'system-admin-list-businesses',
	templateUrl: './system-admin-list-businesses.component.html',
	styleUrls: ['./system-admin-list-businesses.component.scss']
})
export class SystemAdminListBusinessesComponent implements OnInit {
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	businessesSubscription: Subscription;
	dataSource: BusinessesDataSource | null;
	businessesDatabase: BusinessesDatabase;
	inactiveDataSource: BusinessesDataSource | null;
	inactiveDatabase: BusinessesDatabase;
	businesses: Empresa[];
	inactiveBusinesses: Empresa[];

	// Propiedades de ayuda
	displayedColumns = ['imagen', 'nombre', 'rut', 'editar'];

	separatorKeysCodes = [ENTER];
	selectedFilters: string[] = [];
	inputFocused: boolean;
	detallesRow: number = 0;
	areInactiveBusinesses = false;

	constructor(
		public businessService: EmpresasService,
		private alertService: AlertService,
		private authenticationService: AuthenticationService
	) {
		this.businessesDatabase = new BusinessesDatabase();
		this.inactiveDatabase = new BusinessesDatabase();
		this.loadBusinesses();
	}
	loadBusinesses() {
		this.inactiveBusinesses = new Array<Empresa>();

		this.businessesSubscription = this.businessService.getSystemAdminBusinesses().subscribe(response => {
			var allBusinesses = response.data;
			allBusinesses.forEach(business => {
				if (!business.activo) {
					this.inactiveBusinesses.push(business);
					this.areInactiveBusinesses = true;
				}
			});
			this.businesses = allBusinesses.filter(business => business.activo == true);
			this.businessesDatabase.updateBusinesses(this.businesses);
			this.inactiveDatabase.updateBusinesses(this.inactiveBusinesses);
		});
	}
	cargarEmpresas() {
		this.businessService.dataChange.subscribe(changed => {
			if (changed) {
				this.loadBusinesses();
				//this.dataSource = new UsersDataSource(this.usersDatabase, this.paginator, this.sort);
			}
		});
	}

	ngOnInit() {
		this.dataSource = new BusinessesDataSource(this.businessesDatabase, this.paginator, this.sort);
		this.inactiveDataSource = new BusinessesDataSource(this.inactiveDatabase, this.paginator, this.sort);

		this.cargarEmpresas();

		this.paginator._intl.itemsPerPageLabel = 'Por página';
		this.paginator._intl.getRangeLabel = (page, size, length) => `Pág. ${page + 1} de ${Math.ceil(length / size)}`;
	}

	modifyBusiness(business) {
		var emp = business as Empresa;
		localStorage.setItem('business', JSON.stringify(emp));
		this.businessService.showModifyBusiness = true;
	}
}
