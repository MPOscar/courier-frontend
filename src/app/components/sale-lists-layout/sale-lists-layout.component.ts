import { Component, OnInit } from '@angular/core';
import { ListaVenta } from '../../models';
import { AuthenticationService, SaleListService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'sale-lists-layout',
	templateUrl: './sale-lists-layout.component.html',
	styleUrls: ['./sale-lists-layout.component.scss']
})
export class SaleListsLayoutComponent implements OnInit {
	lists: ListaVenta[];
	selectedList: ListaVenta;
	providerId;
	isOnOtherCatalogue: boolean = false;
	loaderVisible: boolean = false;
	constructor(
		public saleListsService: SaleListService,
		private authenticationService: AuthenticationService,
		private route: ActivatedRoute,
		private router: Router
	) {
		var url = this.route.snapshot.url[0];
		if (url.toString() == 'lista-venta-ajena') {
			if (this.route.snapshot.url.length > 0) {
				this.providerId = this.route.snapshot.url[1];
				this.isOnOtherCatalogue = true;
				this.saleListsService.canCreate = false;
			} else {
				this.router.navigate['/lista-proveedores'];
			}
		} else {
			this.saleListsService.canCreate = true;
		}

		this.saleListsService.showCreateList = false;
		this.saleListsService.showList = true;
		this.saleListsService.showEdit = false;
		this.saleListsService.showWatch = false;
		if (!this.isOnOtherCatalogue) {
			if (
				this.authenticationService.can('crearListaDeVenta') ||
				this.authenticationService.can('administradorEmpresa')
			) {
				this.saleListsService.canCreate = true;
			} else {
				//this.saleListsService.canCreate = false;
			}
		}
	}

	ngOnInit() {
		/*this.cargarListas();
		this.saleListsService.dataChange.subscribe(changed => {
			this.lists = this.saleListsService.saleListsDatabase.data;
		});
		this.saleListsService.getLoaderVisibility().subscribe(data => {
			this.loaderVisible = data;
		});*/
	}

	showCreateSaleList() {
		this.selectedList = null;
		this.saleListsService.showCreateList = true;
		this.saleListsService.showList = false;
		this.saleListsService.showEdit = false;
		this.saleListsService.showWatch = false;
	}

	showList() {
		this.saleListsService.showCreateList = false;
		this.saleListsService.showList = true;
		this.saleListsService.showEdit = false;
		this.saleListsService.showWatch = false;
	}

	cargarListas() {
		if (this.isOnOtherCatalogue) {
			this.saleListsService.canCreate = false;
			this.saleListsService.getFromProvider(this.providerId).subscribe(lists => {
				this.lists = lists.data;
				this.saleListsService.saleListsDatabase.updateSaleLists(lists.data);
			});
		} else {
			this.saleListsService.canCreate = true;
			this.saleListsService.getSaleLists().subscribe(groups => {
				this.saleListsService.saleListsDatabase.updateSaleLists(groups);
				this.lists = this.saleListsService.saleListsDatabase.data;
			});
		}
	}
}
