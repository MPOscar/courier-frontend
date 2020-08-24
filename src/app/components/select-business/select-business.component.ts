import { Component, OnInit } from '@angular/core';
import { Empresa } from 'app/models';
import { AuthenticationService, AlertService, EmpresasService, ProductosService } from 'app/services';
import { Router } from '@angular/router';
import { AppConfig } from '../../app.config';

@Component({
	selector: 'app-select-business',
	templateUrl: './select-business.component.html',
	styleUrls: ['./select-business.component.scss']
})
export class SelectBusinessComponent implements OnInit {
	businesses: Empresa[] = [];
	constructor(
		private authenticationService: AuthenticationService,
		private productsService: ProductosService,
		private router: Router,
		private alertService: AlertService,
		private businessService: EmpresasService,
		private appConfi: AppConfig
	) {
		let allBusinessesString = localStorage.getItem('businesses');
		this.businesses = JSON.parse(allBusinessesString);
		this.businessService.getBusinesses();
		this.businesses.forEach(empresa => {
			if (empresa.foto !== null && empresa.foto.indexOf('http') < 0) {
				empresa.foto = this.appConfi.apiBucket + empresa.foto;
			}
		});
	}

	ngOnInit() {
		localStorage.removeItem('business');
		localStorage.removeItem('currentProvider');
		this.productsService.clearProducts();
	}

	goToCreateBusiness() {
		this.businessService.showCreateBusiness = true;
		this.router.navigate(['/crear-empresa']);
	}

	loginCatalogo(id: number) {
		this.authenticationService.loginEmpresa(id).subscribe(
			data => {
				this.productsService.setLoaderVisibility(true);
				this.productsService.loadProductos();
				const redirect = this.authenticationService.redirectUrl;
				this.router.navigateByUrl(redirect || '/catalogo');
			},
			error => this.alertService.error('Usuario o contraseña incorrectos', 'OK')
		);
	}

	loginPedidos(id: number) {
		this.authenticationService
			.loginEmpresa(id)
			.subscribe(
				data => this.router.navigateByUrl('/pedidos'),
				error => this.alertService.error('Usuario o contraseña incorrectos', 'OK')
			);
	}
}
