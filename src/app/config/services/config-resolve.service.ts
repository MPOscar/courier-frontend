import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
//import { TranslateService } from '@ngx-translate/core';

//import { setTranslations } from '@c/ngx-translate';
//import { ErrorHandlingService } from '@c/error-handling';

//import { TRANSLATIONS } from './i18n/config-resolve.service.translations';
import { ConfigService } from './config.service';

@Injectable({
	providedIn: 'root'
})
export class ConfigResolveService implements Resolve<any> {
	constructor(
		/*private errorHandlinService: ErrorHandlingService,*/
		private configService: ConfigService //private translate: TranslateService
	) {
		//setTranslations(this.translate, TRANSLATIONS);
	}

	resolve(route: ActivatedRouteSnapshot): Observable<any> {
		if (this.configService.config) {
			return of(this.configService.config);
		}
		return this.configService.getConfig().pipe(
			tap(),
			catchError(err => {
				//this.errorHandlinService.handleUiError('@c/config/ConfigResolveService/Error', err);
				return of(null);
			})
		);
	}
}
