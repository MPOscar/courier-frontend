import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainComponent } from './components/layouts';

import { MenuComponent } from './components/menu/menu.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { ProductosComponent } from './components/productos/productos.component';
import { OrdenesCompraComponent } from './components/ordenes-compra/ordenes-compra.component';
import { OrdenComponent } from './components/orden/orden.component';
import { PedidoComponent, CrearOCRespuestaDialog } from './components/pedido/pedido.component';
import { InfoDialogComponent } from './components/pedido/info-dialog/info-dialog.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { PlantillasComponent } from './components/plantillas/plantillas.component';

import { CarritoService, OrdenesService, ProductosService, ProveedoresService } from './services';
import { SucursalService } from './services/sucursales.service';
import { SharedModule } from 'app/shared.module';
import { UserGuard } from 'app/guards/user.guard';
import { EmpresasService, SaleListService } from 'app/services';
import { ProductoDetalleComponent } from './components/producto-detalle/pedidos-producto-detalle.component';
import { OCDetalleComponent } from './components/orden-compra-detalle/orden-compra-detalle.component';
import { CrearOCConfirmacionDialogComponent } from './components/pedido/crear-oc-confirmacion-dialog.component';

const CHILDREN_ROUTES: Routes = [
	{ path: '', redirectTo: 'menu', pathMatch: 'full' },
	{ path: 'menu', component: MenuComponent },
	{ path: 'proveedores', component: ProveedoresComponent },
	{ path: 'productos/:proveedor', component: ProductosComponent },
	{ path: 'ordenes', component: OrdenesCompraComponent },
	{ path: 'orden/:numero', component: OrdenComponent },
	{ path: 'pedido', component: PedidoComponent }
];

const ROUTES: Routes = [
	{ path: 'pedidos', component: MainComponent, children: CHILDREN_ROUTES, canActivate: [UserGuard] }
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES), CommonModule, SharedModule],
	exports: [RouterModule],
	declarations: [
		MenuComponent,
		ProveedoresComponent,
		ProductosComponent,
		OrdenesCompraComponent,
		OrdenComponent,
		PedidoComponent,
		CarritoComponent,
		MainComponent,
		CrearOCRespuestaDialog,
		CrearOCConfirmacionDialogComponent,
		InfoDialogComponent,
		ProductoDetalleComponent,
		OCDetalleComponent,
		PlantillasComponent
	],
	providers: [
		ProveedoresService,
		CarritoService,
		OrdenesService,
		ProductosService,
		UserGuard,
		EmpresasService,
		SaleListService,
		SucursalService
	],
	entryComponents: [CrearOCRespuestaDialog, CrearOCConfirmacionDialogComponent, InfoDialogComponent]
})
export class PedidosModule {}
