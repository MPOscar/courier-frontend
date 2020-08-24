import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'app/services';

@Component({
	selector: 'app-visibility-layout',
	templateUrl: './visibility-layout.component.html',
	styleUrls: ['./visibility-layout.component.scss']
})
export class VisibilityLayoutComponent implements OnInit {
	loaderVisible: boolean = true;

	constructor(public productsService: ProductosService) {
		productsService.showVisibilityBusinessList = true;
		productsService.showVisibilitySingleBusiness = false;
		productsService.showVisibilityMassive = false;
	}

	ngOnInit() {
		this.productsService.getLoaderVisibility().subscribe(data => {
			this.loaderVisible = data;
		});
	}

	showList() {
		this.productsService.showVisibilityBusinessList = true;
		this.productsService.showVisibilitySingleBusiness = false;
		this.productsService.showVisibilityMassive = false;
	}
}
