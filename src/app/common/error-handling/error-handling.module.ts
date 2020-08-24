import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
//
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
//
//import { NgxTranslateModule } from '../../ngx-translate';TODO
import { HttpHeadersInterceptorService } from './interceptors/http-headers-interceptor.service';
import { ErrorHandlingInterceptorService } from './interceptors/error-handling-interceptor.service';
import { ToastrService } from './services/toastr.service';
import { CustomSnackbarModule } from './modules/custom-snackbar/custom-snackbar.module';

@NgModule({
	imports: [
		CommonModule,
		MatSnackBarModule,
		TranslateModule.forChild(),
		//NgxTranslateModule,TODO
		CustomSnackbarModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: HttpHeadersInterceptorService, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorHandlingInterceptorService, multi: true },
		ToastrService
	],
	declarations: [],
	exports: []
})
export class ErrorHandlingModule {}
