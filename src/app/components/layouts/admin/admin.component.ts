import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, AlertService } from '../../../services/index';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
	selectedEmpresas: boolean;
	selectedUsuarios: boolean;

	selectedCreateEmpresas: boolean;
	selectedEditarEmpresas: boolean;
	selectedCrearUsuario: boolean;
	selectedListarUsuarios: boolean;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private alertService: AlertService
	) {
		this.selectedEmpresas = false;
		this.selectedUsuarios = true;
		this.selectedCreateEmpresas = true;
		this.selectedEditarEmpresas = false;
		this.selectedCrearUsuario = false;
		this.selectedListarUsuarios = false;
	}

	ngOnInit() {}

	logout(): void {
		this.authenticationService.logout();
	}

	goToBusinesses(): void {
		this.selectedEmpresas = true;
		this.selectedUsuarios = false;
		this.router.navigate(['/admin-empresa']);
	}

	goToUsers(): void {
		this.selectedEmpresas = false;
		this.selectedUsuarios = true;
		this.router.navigate(['/admin-usuarios']);
	}

	goToCreateBusiness(): void {
		this.selectedEmpresas = true;
		this.selectedUsuarios = false;
		this.selectedCreateEmpresas = true;
		this.selectedEditarEmpresas = false;
		this.selectedCrearUsuario = false;
		this.selectedListarUsuarios = false;
		this.router.navigate(['/admin-empresa']);
	}

	goToEditBusinesses(): void {
		this.selectedEmpresas = true;
		this.selectedUsuarios = false;
		this.selectedCreateEmpresas = false;
		this.selectedEditarEmpresas = true;
		this.selectedCrearUsuario = false;
		this.selectedListarUsuarios = false;
		this.router.navigate(['/editar-empresas']);
	}

	goToCreateUser(): void {
		this.selectedEmpresas = false;
		this.selectedUsuarios = true;
		this.selectedCreateEmpresas = false;
		this.selectedEditarEmpresas = false;
		this.selectedCrearUsuario = true;
		this.selectedListarUsuarios = false;
		this.router.navigate(['/admin-proveedores']);
	}

	goToListUsers(): void {}
}
