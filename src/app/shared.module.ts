import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { RegisterLayoutComponent } from './components/layouts/register/register-layout.component';

import { CustomPaginator } from './shared/components/custom-paginator/custom-paginator.component';
import { MyMaterialModule } from './material.module';
import { TablaResponsiveComponent } from './shared/tabla-responsive/tabla-responsive.component';
import { ImageUploadComponent } from './shared/image-upload/image-upload.component';
import { ConfirmDialogModule } from './shared/confirm-dialog/confirm-dialog.module';
import { SearchbarComponent } from './shared/components/searchbar/searchbar.component';

@NgModule({
	imports: [
		RouterModule,
		BrowserModule,
		FlexLayoutModule,
		MyMaterialModule,
		FormsModule,
		ReactiveFormsModule,
		MatProgressButtonsModule,
		CommonModule,
		ConfirmDialogModule
	],
	declarations: [
		RegisterLayoutComponent,
		ImageUploadComponent,
		CustomPaginator,
		TablaResponsiveComponent,
		SearchbarComponent
	],
	exports: [
		RouterModule,
		CommonModule,
		FlexLayoutModule,
		DragDropModule,
		MyMaterialModule,
		FormsModule,
		ReactiveFormsModule,
		RegisterLayoutComponent,
		CustomPaginator,
		ImageUploadComponent,
		MatProgressButtonsModule,
		TablaResponsiveComponent,
		SearchbarComponent
	],
	providers: [NgxImageCompressService]
})
export class SharedModule {}
