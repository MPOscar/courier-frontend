import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminBusinessComponent } from 'app/components/admin-business/admin-business/admin-business.component';
import { EditBusinessesComponent } from 'app/components/admin-business/edit-businesses/edit-businesses.component';
import { EditSingleBusinessComponent } from 'app/components/admin-business/edit-single-business/edit-single-business.component';
import { SystemAdminUsersComponent } from 'app/components/system-admin-users/system-admin-users.component';
import { SystemAdminComponent } from 'app/components/system-admin/system-admin.component';
import { SystemAdminListComponent } from 'app/components/system-admin-list/system-admin-list.component';
import { SystemAdminEditComponent } from 'app/components/system-admin-edit/system-admin-edit.component';
import { SystemAdminCreateBusinessComponent } from 'app/components/system-admin-create-business/system-admin-create-business.component';
import { SystemAdminListBusinessesComponent } from 'app/components/system-admin-list-businesses/system-admin-list-businesses.component';
import { CreateSystemAdminComponent } from 'app/components/create-system-admin/create-system-admin.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminComponent } from 'app/components/layouts/admin/admin.component';
import { SystemAdminGuard } from 'app/guards/system-admin.guard';
import { SharedModule } from 'app/shared.module';

const CHILDREN_ROUTES: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'admin-empresa', component: AdminBusinessComponent },
	{ path: 'editar-empresas', component: EditBusinessesComponent },
	{ path: 'editar-empresa/:id', component: EditSingleBusinessComponent },
	{ path: 'admin-usuarios', component: SystemAdminUsersComponent },
	{ path: 'crear-empresa-admin', component: SystemAdminCreateBusinessComponent },
	{ path: 'system-admin', component: SystemAdminComponent }
];

const ROUTES: Routes = [
	{ path: '', component: AdminComponent, children: CHILDREN_ROUTES, canActivate: [SystemAdminGuard] }
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES), CommonModule, SharedModule, ReactiveFormsModule, FormsModule],
	exports: [RouterModule],
	providers: [SystemAdminGuard],
	declarations: [
		AdminComponent,
		AdminBusinessComponent,
		EditBusinessesComponent,
		EditSingleBusinessComponent,
		SystemAdminUsersComponent,
		SystemAdminComponent,
		SystemAdminListComponent,
		SystemAdminEditComponent,
		SystemAdminCreateBusinessComponent,
		SystemAdminUsersComponent,
		SystemAdminListBusinessesComponent,
		CreateSystemAdminComponent
	]
})
export class SystemAdminModule {}
