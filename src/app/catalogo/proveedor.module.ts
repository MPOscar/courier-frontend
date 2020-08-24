import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BusinessGroupsLayoutComponent } from 'app/components/business-groups-layout/business-groups-layout.component';
import { CatalogoComponent } from 'app/components/catalogo/catalogo.component';
import { BusinessProfileComponent } from '../components/business-profile/business-profile.component';
import { NewProductComponent } from '../components/new-product/new-product.component';
import { ProductDetailComponent } from '../components/product-detail/product-detail.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { ProviderUsersComponent } from '../components/provider-users/provider-users.component';
import { SaleListsLayoutComponent } from '../components/sale-lists-layout/sale-lists-layout.component';
import { ProviderCatalogueComponent } from '../components/supermarkets/provider-catalogue/provider-catalogue.component';
import { ProviderListComponent } from '../components/supermarkets/provider-list/provider-list.component';
import { ProviderWishlistComponent } from '../components/supermarkets/provider-wishlist/provider-wishlist.component';
import { SupermarketProductDetailComponent } from '../components/supermarkets/supermarket-product-detail/supermarket-product-detail.component';
import { VisibilityLayoutComponent } from '../components/visibility-layout/visibility-layout.component';
import { CreateProviderUserComponent } from 'app/components/create-provider-user/create-provider-user.component';
import { ProviderUserEditComponent } from 'app/components/provider-user-edit/provider-user-edit.component';
import { ConfirmDeleteSalesListComponent } from 'app/components/confirm-delete-sales-list/confirm-delete-sales-list.component';
import { AssignVisibilityComponent } from 'app/components/assign-visibility/assign-visibility.component';
import { AssignVisibilityProductsComponent } from 'app/components/assign-visibility-products/assign-visibility-products.component';
import { AssignVisibilityBusinessesComponent } from 'app/components/assign-visibility-businesses/assign-visibility-businesses.component';
import { VisibilityBusinessListComponent } from 'app/components/visibility-business-list/visibility-business-list.component';
import { VisibilitySingleBusinessComponent } from 'app/components/visibility-single-business/visibility-single-business.component';
import { ProductDetailVisibilityComponent } from 'app/components/product-detail-visibility/product-detail-visibility.component';
import { PresentacionPipe } from 'app/pipes/presentacion.pipe';
import { BusinessGroupsListComponent } from 'app/components/business-groups-list/business-groups-list.component';
import { BusinessGroupsComponent } from 'app/components/business-groups/business-groups.component';
import { BusinessGroupsEditComponent } from 'app/components/business-groups-edit/business-groups-edit.component';
import { ProviderUserListComponent } from 'app/components/provider-user-list/provider-user-list.component';
import { SaleListsListComponent } from 'app/components/sale-lists-list/sale-lists-list.component';
import { SaleListWatchComponent } from 'app/components/sale-list-watch/sale-list-watch.component';
import { SaleListsComponent } from 'app/components/sale-lists/sale-lists.component';
import { SaleListBusinessesComponent } from 'app/components/sale-list-businesses/sale-list-businesses.component';
import { SaleListProductsComponent } from 'app/components/sale-list-products/sale-list-products.component';
import { SaleListEditComponent } from 'app/components/sale-list-edit/sale-list-edit.component';
import { CommonModule } from '@angular/common';
import { MainComponent } from 'app/components/layouts';
import { MyBusinessBarComponent } from 'app/components/layouts/main/my-business-bar/my-business-bar.component';
import { OtherBusinessBarComponent } from 'app/components/layouts/main/other-business-bar/other-business-bar.component';
import { SettingsBarComponent } from 'app/components/layouts/main/settings-bar/settings-bar.component';
import { UserGuard } from 'app/guards/user.guard';
import { SharedModule } from 'app/shared.module';
import { BusinessGuard } from 'app/guards/business.guard';
import { ProductoComponent } from '../components/producto/producto.component';
import { ProductoInfoComponent } from '../components/producto-info/producto-info.component';
import { ProductoEmpaquesComponent } from '../components/producto-empaques/producto-empaques.component';
import { ProductoPalletComponent } from '../components/producto-pallet/producto-pallet.component';
import { ProductoCategoriaGpcComponent } from '../components/producto-categoria-gpc/producto-categoria-gpc.component';
import { DetalleProductoCatalogoComponent } from '../components/detalle-producto-catalogo/detalle-producto-catalogo.component';
import { TablaCatalogoComponent } from '../components/tabla-catalogo/tabla-catalogo.component';
import { FiltrosCatalogoComponent } from '../components/filtros-catalogo/filtros-catalogo.component';
import { VisibleProductsComponent } from '../components/bussisnes-product-visibility/visible-products/visible-products.component';
import { BussisnesWithVisibilityComponent } from '../components/bussisnes-product-visibility/bussisnes-with-visibility/bussisnes-with-visibility.component';
import { SelectorProductosComponent } from '../components/selector-productos/selector-productos.component';
import { SelectorProductosTablaComponent } from '../components/selector-productos-tabla/selector-productos-tabla.component';
import { VisibilitySingleBusinessEditComponent } from '../components/visibility-single-business-edit/visibility-single-business-edit.component';
import { SelectorEmpresasComponent } from '../components/selector-empresas/selector-empresas.component';
import { SelectorEmpresasTablaComponent } from '../components/selector-empresas-tabla/selector-empresas-tabla.component';

const CHILDREN_ROUTES: Routes = [
	{ path: '', redirectTo: 'catalogo', pathMatch: 'full' },
	{ path: 'perfil', component: ProfileComponent },
	{ path: 'perfil-empresa', component: BusinessProfileComponent },
	{ path: 'grupos-empresas', component: BusinessGroupsLayoutComponent },
	{ path: 'producto-detalle/:id', component: ProductDetailComponent },
	{ path: 'catalogo', component: CatalogoComponent },
	{ path: 'usuarios-proveedor', component: ProviderUsersComponent },
	{ path: 'listas-venta', component: SaleListsLayoutComponent },
	{ path: 'nuevo-producto', component: NewProductComponent },
	{ path: 'visibilidad', component: VisibilityLayoutComponent },
	{ path: 'lista-proveedores', component: ProviderListComponent },
	{ path: 'catalogo-proveedor/:id', component: ProviderCatalogueComponent },
	{ path: 'lista-venta-ajena/:id', component: SaleListsLayoutComponent },
	{ path: 'lista-exportacion-proveedor/:id', component: ProviderWishlistComponent },
	{ path: 'cliente-producto-detalle/:id/:providerId', component: SupermarketProductDetailComponent }
];

const ROUTES: Routes = [
	{ path: '', component: MainComponent, children: CHILDREN_ROUTES, canActivate: [BusinessGuard] }
];

@NgModule({
	imports: [RouterModule.forChild(ROUTES), CommonModule, SharedModule],
	exports: [RouterModule],
	providers: [UserGuard],
	declarations: [
		MainComponent,
		MyBusinessBarComponent,
		OtherBusinessBarComponent,
		SettingsBarComponent,
		ProfileComponent,
		BusinessProfileComponent,
		BusinessGroupsLayoutComponent,
		CatalogoComponent,
		SaleListsComponent,
		SaleListBusinessesComponent,
		SaleListProductsComponent,
		SaleListEditComponent,
		ProviderUsersComponent,
		ProviderUserListComponent,
		SaleListsListComponent,
		SaleListWatchComponent,
		NewProductComponent,
		VisibilityLayoutComponent,
		ProviderListComponent,
		SaleListsLayoutComponent,
		ProviderWishlistComponent,
		ProductDetailComponent,
		ProviderCatalogueComponent,
		BusinessGroupsListComponent,
		BusinessGroupsComponent,
		BusinessGroupsEditComponent,
		BussisnesWithVisibilityComponent,
		SupermarketProductDetailComponent,
		CreateProviderUserComponent,
		ProviderUserEditComponent,
		ConfirmDeleteSalesListComponent,
		AssignVisibilityComponent,
		AssignVisibilityProductsComponent,
		AssignVisibilityBusinessesComponent,
		VisibilityBusinessListComponent,
		VisibilitySingleBusinessComponent,
		ProductDetailVisibilityComponent,
		PresentacionPipe,
		ProductoComponent,
		ProductoInfoComponent,
		ProductoEmpaquesComponent,
		ProductoPalletComponent,
    ProductoCategoriaGpcComponent,
		DetalleProductoCatalogoComponent,
		TablaCatalogoComponent,
		FiltrosCatalogoComponent,
		VisibleProductsComponent,
		SelectorProductosComponent,
		SelectorProductosTablaComponent,
		VisibilitySingleBusinessEditComponent,
		SelectorEmpresasComponent,
		SelectorEmpresasTablaComponent
	],
	entryComponents: [CreateProviderUserComponent, ProviderUserEditComponent, ConfirmDeleteSalesListComponent]
})
export class ProveedorModule {}
