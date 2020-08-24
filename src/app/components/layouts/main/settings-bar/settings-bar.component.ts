import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/services';

@Component({
	selector: 'settings-bar',
	templateUrl: './settings-bar.component.html',
	styleUrls: ['./settings-bar.component.scss']
})
export class SettingsBarComponent implements OnInit {
	showUsers = false;
	background: any;
	constructor(private authenticationService: AuthenticationService) {
		if (this.authenticationService.can('administradorEmpresa')) {
			this.showUsers = true;
		} else {
			if (this.authenticationService.can('administrador')) {
				this.showUsers = true;
			}
		}
	}

	ngOnInit() {}
}
