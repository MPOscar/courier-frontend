import { ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { SaleListsDatabase, SaleListsDataSource } from 'app/data-sources';
import { Producto, Empresa, ListaDeVenta, Grupo } from 'app/models';
import { ListaDeVentaBasic } from 'app/models/ListaDeVenta/ListaDeVenta';
import { AlertService, AuthenticationService, SaleListService } from 'app/services';
import { Subscription } from 'rxjs';
import { ConfirmDeleteSalesListComponent } from '../confirm-delete-sales-list/confirm-delete-sales-list.component';
@Component({
	selector: 'sale-lists-list',
	templateUrl: './sale-lists-list.component.html',
	styleUrls: ['./sale-lists-list.component.scss']
})
export class SaleListsListComponent implements OnInit {
	@Input() group;

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	saleListsSubscription: Subscription;
	dataSource: SaleListsDataSource | null;
	saleListsDatabase: SaleListsDatabase;
	showList = true;
	saleLists: ListaDeVenta[] = [];
	saleListsLength: number = 0;
	listaVentaBasicDataSource: MatTableDataSource<ListaDeVentaBasic>;

	// Propiedades de ayuda
	displayedColumns = ['nombre', 'descripcion', 'quitar'];
	separatorKeysCodes = [ENTER];
	selectedFilters: string[] = [];
	inputFocused: boolean;
	detallesRow: number = 0;
	canEdit = false;
	constructor(
		public saleListService: SaleListService,
		private alertService: AlertService,
		private authenticationService: AuthenticationService,
		public dialog: MatDialog,
		private router: Router
	) {
		this.saleListsDatabase = saleListService.saleListsDatabase;
		if (
			this.authenticationService.can('crearListaDeVenta') ||
			this.authenticationService.can('administradorEmpresa')
		) {
			this.canEdit = true;
		} else this.canEdit = false;
	}

	loadSaleLists() {
		this.saleListsDatabase = this.saleListService.saleListsDatabase;
		this.saleLists = this.saleListsDatabase.data;
		this.saleListsLength = this.saleLists.length;
		this.dataSource = new SaleListsDataSource(this.saleListsDatabase, this.paginator, this.sort);
	}

	cargarListas() {
		this.saleListsSubscription = this.saleListService.dataChange.subscribe(changed => {
			if (changed) {
				this.loadSaleLists();
			}
		});
	}

	ngOnInit() {
		this.saleListService.loadSaleListsBasic().subscribe(response => {
			this.listaVentaBasicDataSource = new MatTableDataSource<ListaDeVentaBasic>([]);
			this.listaVentaBasicDataSource.data = response.data;
			this.saleListService.saleListsDatabase.updateSaleLists(response.data);
		});
		/*this.saleListService.loadSaleList();
		this.dataSource = new SaleListsDataSource(this.saleListsDatabase, this.paginator, this.sort);
		this.setPaginatorSettings();
		this.cargarListas();*/
	}

	setPaginatorSettings() {
		this.paginator._intl.itemsPerPageLabel = 'Listas por página';
		this.paginator._intl.getRangeLabel = (page, size, length) => `Pág. ${page + 1} de ${Math.ceil(length / size)}`;
	}

	openDeleteDialog(listToDelete): void {
		const dialogRef = this.dialog.open(ConfirmDeleteSalesListComponent, {
			width: '450px',
			data: { list: listToDelete }
		});
		dialogRef.afterClosed().subscribe(result => {
			this.router.navigate(['/listas-venta']);
		});
	}

	editSaleList(list) {
		this.saleListService.loadSaleListId(list.id).subscribe(response => {
			var listToEdit = response.data;
			listToEdit.empresas = Array<Empresa>();
			listToEdit.listaEmpresas.forEach(function(businessFromSaleList) {
				listToEdit.empresas.push(businessFromSaleList);
			});
			listToEdit.grupos = Array<Grupo>();
			listToEdit.listaGrupos.forEach(function(groupFromSaleList) {
				listToEdit.grupos.push(groupFromSaleList);
			});

			listToEdit.productos = Array<Producto>();
			listToEdit.listaProductos.forEach(function(productFromSaleList) {
				listToEdit.productos.push(productFromSaleList);
			});

			this.saleListService.showWatch = false;
			this.saleListService.showEdit = true;
			this.saleListService.showList = false;
			this.saleListService.listToEdit = listToEdit;
			this.saleListService.dataChange.emit(true);
		});
	}

	watchSaleList(list) {
		this.saleListService.loadSaleListId(list.id).subscribe(response => {
			var listToEdit = response.data;
			listToEdit.empresas = Array<Empresa>();
			listToEdit.listaEmpresas.forEach(function(businessFromSaleList) {
				listToEdit.empresas.push(businessFromSaleList);
			});
			listToEdit.grupos = Array<Grupo>();
			listToEdit.listaGrupos.forEach(function(groupFromSaleList) {
				listToEdit.grupos.push(groupFromSaleList);
			});

			listToEdit.productos = Array<Producto>();
			listToEdit.listaProductos.forEach(function(productFromSaleList) {
				listToEdit.productos.push(productFromSaleList);
			});

			this.saleListService.otherSaleList = false;
			this.saleListService.showWatch = true;
			this.saleListService.showEdit = false;
			this.saleListService.showList = false;
			this.saleListService.listToEdit = listToEdit;
			this.saleListService.dataChange.emit(true);
		});
	}

	showCreateSaleList() {
		this.saleListService.showCreateList = true;
		this.saleListService.showList = false;
		this.saleListService.showEdit = false;
		this.saleListService.showWatch = false;
	}

	ngOnDestroy() {
		//this.saleListsSubscription.unsubscribe();
	}
}
