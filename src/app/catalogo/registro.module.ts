import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreateBusinessComponent } from 'app/components/create-business/create-business.component';
import { ConfirmUserComponent } from 'app/components/confirm-user/confirm-user.component';
import { AcceptInvitationComponent } from 'app/components/accept-invitation/accept-invitation.component';
import { RegisterFromInvitationComponent } from 'app/components/register-from-invitation/register-from-invitation.component';
import { SendEmailComponent } from 'app/components/send-email/send-email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from 'app/components/register/register.component';
import { ForgotPasswordComponent } from 'app/components/forgot-password/forgot-password.component';
import { RegisterLayoutComponent } from 'app/components/layouts/register/register-layout.component';
import { SharedModule } from 'app/shared.module';

const CHILDREN_ROUTES: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'crear-empresa', component: CreateBusinessComponent },
	{ path: 'confirm-user/:id', component: ConfirmUserComponent },
	{ path: 'accept-invitation/:id', component: AcceptInvitationComponent },
	{ path: 'registro-invitacion', component: RegisterFromInvitationComponent },
	{ path: 'enviar-email', component: SendEmailComponent }
];

const ROUTES: Routes = [
	{ path: '', component: RegisterLayoutComponent, children: CHILDREN_ROUTES },
	{ path: 'registro', component: RegisterComponent },
	{ path: 'olvide-mi-contrasena', component: ForgotPasswordComponent }
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES), CommonModule, ReactiveFormsModule, FormsModule, SharedModule],
	exports: [RouterModule],
	declarations: [
		RegisterComponent,
		ConfirmUserComponent,
		CreateBusinessComponent,
		RegisterFromInvitationComponent,
		SendEmailComponent,
		AcceptInvitationComponent,
		ForgotPasswordComponent
	]
})
export class RegistroModule {}
