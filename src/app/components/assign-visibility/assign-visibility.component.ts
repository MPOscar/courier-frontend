import { Component, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { AlertService, ProductosService, AuthenticationService } from 'app/services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'assign-visibility',
	templateUrl: './assign-visibility.component.html',
	styleUrls: ['./assign-visibility.component.scss']
})
export class AssignVisibilityComponent implements OnInit {
	constructor(
		private alertService: AlertService,
		private productsService: ProductosService,
		private authenticationService: AuthenticationService
	) {}

	ngOnInit() {}

	productsChosen(stepper: MatStepper) {
		stepper.next();
	}

	businessesChosen(stepper: MatStepper) {
		if (
			this.productsService.productsForMassiveVisibilityChosen &&
			(this.productsService.businessesForMassiveVisibilityChosen ||
				this.productsService.groupsForMassiveVisibilityChosen ||
				this.productsService.privacyChosen)
		) {
			try {
				this.productsService.saveMassiveVisibility(true, true).subscribe(
					data => {
						this.alertService.success('Visibilidad guardada con éxito');
						this.productsService.productsForMassiveVisibilityChosen = false;
						this.productsService.businessesForMassiveVisibilityChosen = false;
						this.productsService.groupsForMassiveVisibilityChosen = false;
						this.productsService.productsForMassiveVisibility = [];
						this.productsService.businessesForMassiveVisibility = [];
						this.productsService.groupsForMassiveVisibility = [];
						this.productsService.showVisibilityBusinessList = true;
						this.productsService.showVisibilityMassive = false;
						this.productsService.showVisibilitySingleBusiness = false;
						this.productsService.productsForMassiveVisibilityChosen = false;
					},
					error => {
						var httpError = error as HttpErrorResponse;
						if (httpError.status == 401) {
							this.alertService.error('Debes iniciar sesión.', 'OK');
							this.authenticationService.logout();
						} else {
							this.alertService.error('Ocurrió un error.', 'OK');
						}
					}
				);
			} catch (e) {
				this.alertService.error('Ocurrió un error: ' + e);
			}
		} else {
			this.alertService.error('Debes agregar por lo menos un producto y una empresa / grupo de empresas');
		}
	}
	showList() {
		this.productsService.showVisibilityBusinessList = true;
		this.productsService.showVisibilitySingleBusiness = false;
		this.productsService.showVisibilityMassive = false;
	}
}
