import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/services';

@Component({
	selector: 'my-business-bar',
	templateUrl: './my-business-bar.component.html',
	styleUrls: ['./my-business-bar.component.scss']
})
export class MyBusinessBarComponent implements OnInit {
	showVisibility = false;
	background: any;
	constructor(private authenticationService: AuthenticationService) {
		if (
			this.authenticationService.can('administradorEmpresa') ||
			this.authenticationService.can('editarProductos')
		) {
			this.showVisibility = true;
		}
	}

	ngOnInit() {}
}
