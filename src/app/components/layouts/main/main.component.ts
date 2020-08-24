import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, SaleListService, UsuariosService } from '../../../services/index';

@Component({
	moduleId: module.id,
	templateUrl: 'main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent {
	showMyBusiness = true;
	showOtherBusiness = false;
	showSettings = false;
	activeLink = 0;
	flat: any;
	background: any;

	constructor(
		private router: Router,
		private saleListsService: SaleListService,
		public usersService: UsuariosService,
		private authenticationService: AuthenticationService
	) {}

	ngOnInit() {
		let pos = JSON.parse(localStorage.getItem('navBarPos'));
		if (pos) {
			this.changeNavbarPos(parseInt(pos));
		} else {
			this.changeNavbarPos(0);
		}
	}

	changeNavbarPos(pos) {
		this.activeLink = pos;
		localStorage.setItem('navBarPos', JSON.stringify(pos));

		switch (pos) {
			case 0: {
				this.doShowMyBusiness();
				break;
			}
			case 1: {
				this.doShowOtherBusiness();
				break;
			}
			case 2: {
				this.doShowSettings();
				break;
			}
			default: {
				this.doShowMyBusiness();
				break;
			}
		}
	}

	doShowMyBusiness() {
		this.showMyBusiness = true;
		this.showOtherBusiness = false;
		this.showSettings = false;
	}

	doShowOtherBusiness() {
		this.showMyBusiness = false;
		this.showOtherBusiness = true;
		this.showSettings = false;
	}

	doShowSettings() {
		this.showMyBusiness = false;
		this.showOtherBusiness = false;
		this.showSettings = true;
	}

	logout(): void {
		this.authenticationService.logout();
	}

	goToCreateList() {
		this.saleListsService.showCreateList = true;
		this.saleListsService.showList = false;
		this.router.navigate(['/listas-venta']);
	}

	goToListLists() {
		this.saleListsService.showCreateList = false;
		this.saleListsService.showList = true;
		this.router.navigate(['/listas-venta']);
		/**saleListsService.showCreateList */
	}

	get nombreEmpresa() {
		return this.authenticationService.getNombreEmpresa();
	}

	get nombreCompleto() {
		return this.authenticationService.getNombreCompleto();
	}
}
