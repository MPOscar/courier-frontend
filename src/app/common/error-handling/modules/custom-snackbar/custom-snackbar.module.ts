import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
//
import { CustomSnackbarComponent } from './components/custom-snackbar/custom-snackbar.component';

@NgModule({
	imports: [CommonModule, MatIconModule, TranslateModule.forChild()],
	declarations: [CustomSnackbarComponent],
	exports: [CustomSnackbarComponent]
})
export class CustomSnackbarModule {}
