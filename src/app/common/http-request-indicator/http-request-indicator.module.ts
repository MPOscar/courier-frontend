import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
//
import { HttpRequestIndicatorComponent } from './components/http-request-indicator/http-request-indicator.component';
import { IndicatedInterceptor } from './services/indicated-interceptor.service';
import { LoadingInterceptor } from './services/loading-interceptor.service';
import { LoadingComponent } from './components/loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
	imports: [CommonModule, MatProgressSpinnerModule],
	declarations: [HttpRequestIndicatorComponent, LoadingComponent],
	exports: [HttpRequestIndicatorComponent, LoadingComponent]
})
export class HttpRequestIndicatorModule {
	static forRoot(): ModuleWithProviders<HttpRequestIndicatorModule> {
		return {
			ngModule: HttpRequestIndicatorModule,
			providers: [
				{ provide: HTTP_INTERCEPTORS, useClass: IndicatedInterceptor, multi: true },
				{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
			]
		};
	}
}
