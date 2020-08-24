import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'app/app.config';
import { GroupBusinessesDataSource } from 'app/data-sources/group-business-data-source';
import { GroupBusinessesDatabase } from 'app/data-sources/group-business-database';
import { Empresa, Grupo, ListaDeVenta, Producto } from 'app/models';
import { CategoriasService, EmpresasService, SaleListService } from 'app/services';
import { Subscription } from 'rxjs';

@Component({
	selector: 'sale-list-watch',
	templateUrl: './sale-list-watch.component.html',
	styleUrls: ['./sale-list-watch.component.scss']
})
export class SaleListWatchComponent implements OnInit {
	showBusinessesAndGroups = true;
	providerId: number;
	provider: String;
	products: Producto[] = [];
	productsWithCategories: Producto[] = [];
	productsWithCategoriesBuffer: Producto[] = [];
	categoriesQuantity = 0;
	businessesGroupDataSourceLength: number = 0;
	showGroups = false;

	categorySubscription: Subscription;

	productsArray: any[] = new Array<any>();
	list: ListaDeVenta;

	addedGroupBusinessDatabase: GroupBusinessesDatabase;
	addedGroupBusinessesDataSource: GroupBusinessesDataSource | null;
	@ViewChild('addedGroupsSort', { static: true }) addedGroupsSort: MatSort;
	@ViewChild('groupsPaginator', { static: true }) groupsPaginator: MatPaginator;
	addedGroupTableData: (Grupo | Empresa)[] = [];
	displayedColumnsGroups = ['tituloGrupo', 'nombre', 'razonSocial', 'gln'];
	displayedColumnsGroup = ['nombre'];
	public isSupermarket: boolean;

	public businesses: Empresa[] = [];

	constructor(
		public saleListService: SaleListService,
		private route: ActivatedRoute,
		private providerService: EmpresasService,
		private categoryService: CategoriasService,
		public appConfig: AppConfig
	) {
		this.providerId = this.route.snapshot.params['id'];
		this.provider = this.providerService.currentProviderName;
		this.isSupermarket = this.saleListService.otherSaleList;
	}

	ngOnInit() {
		this.subscribeToServices();
		this.initializeVariables();
		this.loadProducts();
		this.initializeDataSources();
	}

	ngAfterViewInit() {
		this.showBusinessesAndGroups = this.saleListService.canCreate;
	}

	initializeVariables() {
		this.list = this.saleListService.listToEdit;
		this.products = this.list.listaProductos;
		this.businesses = this.list.listaEmpresas;
		var grupos = this.list.listaGrupos;
		if (this.products == undefined) this.products = this.list.productos;
		if (this.businesses == undefined) this.businesses = this.list.empresas;
		if (grupos == undefined) grupos = this.list.grupos;
		this.addedGroupTableData = [];
	}

	loadProducts() {
		this.products.forEach(product => {
			if (product.categoria && !product.categoria.nombre) {
				this.loadCategories(product);
			}
		});
	}

	loadCategories(product) {
		if (typeof product.categoria == 'number') {
			this.categorySubscription = this.categoryService.getCategory(product.categoria).subscribe(res => {
				product.categoria = res.data;
				this.productsWithCategoriesBuffer.push(product);
				this.categoriesQuantity++;
				if (this.categoriesQuantity === this.products.length) {
					this.productsWithCategories = this.productsWithCategoriesBuffer;
				}
			});
		}
	}

	initializeDataSources() {
		if (this.saleListService.canCreate) {
			this.addedGroupBusinessDatabase = new GroupBusinessesDatabase();
			this.addedGroupBusinessesDataSource = new GroupBusinessesDataSource(
				this.addedGroupBusinessDatabase,
				this.groupsPaginator,
				this.addedGroupsSort
			);

			this.addedGroupBusinessesDataSource.paginator._intl.itemsPerPageLabel = 'Por página';
			this.addedGroupBusinessesDataSource.paginator._intl.getRangeLabel = (page, size, length) =>
				`Pág. ${page + 1} de ${Math.ceil(length / size)}`;
			this.businessesGroupDataSourceLength = this.list.grupos.length;

			this.saleListService.listToEdit.grupos.forEach(grupo => {
				this.addGroupToVisible(grupo);
			});
			if (this.addedGroupBusinessDatabase.data.length != 0) {
				this.showGroups = true;
			}
		}
	}

	subscribeToServices() {
		this.categorySubscription = this.categoryService.dataChange.subscribe(changed => {
			if (changed) {
				this.loadProducts();
			}
		});
	}

	addGroupToVisible(group: any) {
		if (group != null) {
			var existingGroup: Grupo = group;
			if (existingGroup != null) {
				this.addedGroupTableData.push(existingGroup);
				if (existingGroup.empresas) {
					existingGroup.empresas.forEach(empresa => {
						this.addedGroupTableData.push(empresa);
					});
				}
				this.addedGroupBusinessDatabase.updateElement(this.addedGroupTableData);
			}
		}
	}

	isGroup(index, item): boolean {
		return item.descripcion != undefined;
	}

	ngOnDestroy() {
		this.categorySubscription.unsubscribe();
	}
}
