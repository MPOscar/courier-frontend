import { Component, OnInit } from '@angular/core';
import { ErrorHandlingService } from './common/error-handling/services/error-handling.service';
import { AuthenticationService } from 'app/services';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(
		private authenticationService: AuthenticationService,
		private errorHandlingService: ErrorHandlingService
	) {}

	ngOnInit() {
		this.errorHandlingService.showExpireLogin.subscribe(userDetails => {
			this.authenticationService.tokenIsFresh.next(false);
			this.authenticationService.openLoginDialog();
		});
	}
}
