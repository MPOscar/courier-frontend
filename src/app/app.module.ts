import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CdkTableModule } from '@angular/cdk/table';
import { AppRoutingModule } from './app.routing';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorHandlingModule } from './common/error-handling/error-handling.module';
import { HttpRequestIndicatorModule } from './common/http-request-indicator/http-request-indicator.module';
import { LoadingComponent } from './common/http-request-indicator/components/loading/loading.component';
import { CustomSnackbarComponent } from './common/error-handling/modules/custom-snackbar/components/custom-snackbar/custom-snackbar.component';

//
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { LoginComponent } from './components/login/login.component';
import {
	ProveedoresService,
	GruposService,
	ProductosService,
	AuthenticationService,
	AlertService,
	PresentacionesService,
	EmpresasService,
	CategoriasService,
	ExcelService,
	TiendaInglesaExportService,
	ProviderExportService,
	TataExportService,
	TataIndividualExportService,
	UsuariosService,
	SaleListService,
	RolesService
} from './services';
import { AppConfig } from './app.config';
import { getSpanishPaginatorIntl } from './spanish-paginator-intl';
import { ExportService } from './services/export.service';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { CountryService } from './services/country.service';
import { ProveedorModule } from './catalogo/proveedor.module';
import { RegistroModule } from './catalogo/registro.module';
import { SystemAdminModule } from './catalogo/system-admin.module';
import { SelectBusinessComponent } from './components/select-business/select-business.component';
import { PedidosModule } from './pedidos/pedidos.module';
import { SharedModule } from './shared.module';
import localeEsUY from '@angular/common/locales/es-UY';
import { registerLocaleData } from '@angular/common';
import { ConfirmDialogComponent } from './shared/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogParameterComponent } from './shared/confirm-dialog/components/confirm-dialog-parameter/confirm-dialog-parameter.component';

registerLocaleData(localeEsUY);

export function AppConfigFactory(providerAppConfig: AppConfig) {
	return () => providerAppConfig.loadConfig();
}
import { GenericDialogComponent } from './shared/generic-dialog/generic-dialog.component';
import { Error404Component } from './components/error404/error404.component';
import { LoginDialogComponent } from './shared/login-dialog/login-dialog.component';
import { DragDropDirective } from './shared/directives/drag-drop.directive';
import { ExcelUploadComponent } from './shared/excel-upload/excel-upload.component';
import { ExcelUploadInfoComponent } from './shared/excel-upload-info/excel-upload-info.component';

export const createTranslateLoader = (http: HttpClient) => {
	// for development
	/*return new TranslateHttpLoader(
      http,
      '/start-javascript/sb-admin-material/master/dist/assets/i18n/',
      '.json'
  );*/
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};
@NgModule({
	bootstrap: [AppComponent],
	declarations: [
		AppComponent,
		LoginComponent,
		SelectBusinessComponent,
		PasswordResetComponent,
		GenericDialogComponent,
		Error404Component,
		LoginDialogComponent,
		DragDropDirective,
		ExcelUploadComponent,
		ExcelUploadInfoComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		CdkTableModule,
		ProveedorModule,
		RegistroModule,
		SystemAdminModule,
		PedidosModule,
		AppRoutingModule,
		SharedModule,
		//
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient]
			}
		}),
		ErrorHandlingModule,
		HttpRequestIndicatorModule
	],
	providers: [
		CountryService,
		ProductosService,
		ProveedoresService,
		PresentacionesService,
		CategoriasService,
		AuthenticationService,
		AlertService,
		EmpresasService,
		GruposService,
		ExcelService,
		TiendaInglesaExportService,
		ProviderExportService,
		TataExportService,
		TataIndividualExportService,
		ExportService,
		UsuariosService,
		SaleListService,
		RolesService,
		AppConfig,
		{ provide: APP_INITIALIZER, useFactory: AppConfigFactory, deps: [AppConfig], multi: true },
		{ provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
	],
	entryComponents: [
		GenericDialogComponent,
		LoginDialogComponent,
		ExcelUploadComponent,
		LoadingComponent,
		CustomSnackbarComponent,
		ConfirmDialogComponent,
		ConfirmDialogParameterComponent,
		ExcelUploadInfoComponent
	]
})
export class AppModule {}
