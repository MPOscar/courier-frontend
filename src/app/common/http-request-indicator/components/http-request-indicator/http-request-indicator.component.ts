import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';

// "@types/lodash": "ts2.0",
// "lodash": "4.17.4",
// "lodash.uniqueid": "4.0.1"
import * as _ from 'lodash';

import { HttpRequestIndicatorsService } from '../../services/http-request-indicators.service';
import { LoadingService } from '../../services/loading.service';

@Component({
	selector: 'http-request-indicator',
	templateUrl: './http-request-indicator.component.html',
	styleUrls: ['./http-request-indicator.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HttpRequestIndicatorComponent implements OnInit, OnDestroy {
	uid: string = _.uniqueId();

	@Input() urlExpressions: Array<string>;

	subscription: Subscription;

	constructor(private httpRequestIndicators: HttpRequestIndicatorsService, private loadingService: LoadingService) {}

	ngOnInit() {
		this.subscription = this.httpRequestIndicators
			.registerIndicator(this.uid, this.urlExpressions)
			.subscribe((visible: boolean) => {
				this.loadingService.loading$.next(visible);
			});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.httpRequestIndicators.unregisterIndicator(this.uid);
	}
}
