import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BusinessesDatabase, BusinessesDataSource } from 'app/data-sources';
import { Empresa } from 'app/models';
import { AuthenticationService, ProductosService, EmpresasService } from 'app/services';

@Component({
	selector: 'visibility-business-list',
	templateUrl: './visibility-business-list.component.html',
	styleUrls: ['./visibility-business-list.component.scss']
})
export class VisibilityBusinessListComponent implements OnInit {
	@ViewChild('paginator', { static: true }) businessesPaginator: MatPaginator;
	@ViewChild('sort', { static: true }) businessesSort: MatSort;

	businesses: Array<Empresa>;
	database: BusinessesDatabase;
	dataSource: BusinessesDataSource | null;
	businessesListLength: number = 0;
	showLoader: boolean = false;
	displayedColumns = ['nombre', 'razonSocial', 'options'];

	canEdit = false;
	constructor(
		public productsService: ProductosService,
		private businessesService: EmpresasService,
		private authenticationService: AuthenticationService
	) {
		this.database = new BusinessesDatabase();
		if (
			this.authenticationService.can('crearListaDeVenta') ||
			this.authenticationService.can('administradorEmpresa')
		) {
			this.canEdit = true;
		} else this.canEdit = false;
	}

	ngOnInit(): void {
		this.dataSource = new BusinessesDataSource(this.database, this.businessesPaginator, this.businessesSort);
		this.businessesPaginator._intl.itemsPerPageLabel = 'Por página';
		this.businessesPaginator._intl.getRangeLabel = (page, size, length) =>
			`Pág. ${page + 1} de ${Math.ceil(length / size)}`;

		this.loadBusinesses();
	}

	loadBusinesses() {
		this.showLoader = true;
		this.businessesService.getBusinessesWithVisibility().subscribe(response => {
			this.showLoader = false;
			this.businesses = response.data;
			this.businessesListLength = response.data.length;
			this.database.updateBusinesses(this.businesses);
		});
	}

	watchBusiness(b: Empresa) {
		this.productsService.showVisibilityBusinessList = false;
		this.productsService.editBusinessVisibility = false;
		this.productsService.showVisibilitySingleBusiness = true;
		this.productsService.showVisibilityMassive = false;
		this.productsService.businessForVisibility = b;
	}
	editBusiness(b: Empresa) {
		this.productsService.showVisibilityBusinessList = false;
		this.productsService.editBusinessVisibility = true;
		this.productsService.showVisibilitySingleBusiness = true;
		this.productsService.showVisibilityMassive = false;
		this.productsService.businessForVisibility = b;
	}
	showMassive() {
		this.productsService.showVisibilityBusinessList = false;
		this.productsService.showVisibilitySingleBusiness = false;
		this.productsService.showVisibilityMassive = true;
	}
}
