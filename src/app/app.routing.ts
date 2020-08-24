import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { NgModule } from '@angular/core';
import { SelectBusinessComponent } from './components/select-business/select-business.component';
import { RegisterLayoutComponent } from './components/layouts/register/register-layout.component';
import { Error404Component } from './components/error404/error404.component';
import { UserGuard } from './guards/user.guard';

const ROUTES: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'password-reset/:id', component: PasswordResetComponent },
	{
		path: '',
		component: RegisterLayoutComponent,
		children: [{ path: 'seleccionar-empresa', component: SelectBusinessComponent, canActivate: [UserGuard] }]
	},
	{
		path: '',
		loadChildren: () => import('./catalogo/proveedor.module').then(m => m.ProveedorModule)
	},
	{
		path: '',
		loadChildren: () => import('./catalogo/registro.module').then(m => m.RegistroModule)
	},
	{
		path: '',
		loadChildren: () => import('./catalogo/system-admin.module').then(m => m.SystemAdminModule)
	},
	{
		path: 'pedidos',
		loadChildren: () => import('./pedidos/pedidos.module').then(m => m.PedidosModule)
	},
	{ path: '**', component: Error404Component }
];

@NgModule({
	imports: [RouterModule.forRoot(ROUTES)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
