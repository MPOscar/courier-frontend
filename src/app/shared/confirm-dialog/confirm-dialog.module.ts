import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//
import { TranslateModule } from '@ngx-translate/core';
//
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogParameterComponent } from './components/confirm-dialog-parameter/confirm-dialog-parameter.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule.forChild(),
		MatDialogModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule
	],
	declarations: [ConfirmDialogComponent, ConfirmDialogParameterComponent],
	exports: [ConfirmDialogComponent]
})
export class ConfirmDialogModule {}
