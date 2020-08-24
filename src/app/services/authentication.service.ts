import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppConfig } from '../app.config';
import { DialogService } from './dialog.service';
import { AlertService } from './alert.service';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthenticationService {
	private roles;
	private usuario: any = null;
	private email: string;
	private idUsuario: string;
	public redirectUrl: string;
	private loginDialogData: Subject<any> = new Subject();
	private cachedRequests: Array<HttpRequest<any>> = [];
	public tokenIsFresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

	constructor(
		private http: HttpClient,
		private config: AppConfig,
		private dialogService: DialogService,
		private alertService: AlertService
	) {}

	login(formUsuario) {
		return this.http.post(this.config.apiUrl + '/auth/login', formUsuario).pipe(
			map(
				(response: any) => {
					const data = response.data;
					localStorage.setItem('token', data['token']);
					localStorage.setItem('role', 'providerAdmin');
					localStorage.setItem('roles', JSON.stringify(data['roles']));
					localStorage.setItem('user', JSON.stringify(data['user']));
					if (data['business'] != undefined) {
						localStorage.setItem('business', JSON.stringify(data['business']));
					}
					localStorage.setItem('businesses', JSON.stringify(data['businesses']));
					this.isLoggedIn();
				},
				err => false
			)
		);
	}

	loginExpired(formUsuario, empresaId) {
		return this.http.post(this.config.apiUrl + '/auth/login', formUsuario).pipe(
			map(
				(response: any) => {
					const data = response.data;
					localStorage.setItem('token', data['token']);
					localStorage.setItem('role', 'providerAdmin');
					localStorage.setItem('roles', JSON.stringify(data['roles']));
					localStorage.setItem('user', JSON.stringify(data['user']));
					if (data['business'] != undefined) {
						localStorage.setItem('business', JSON.stringify(data['business']));
					}
					localStorage.setItem('businesses', JSON.stringify(data['businesses']));
					this.isLoggedIn();
					if (empresaId > 0) {
						this.loginEmpresa(empresaId).subscribe(
							data => {},
							error => {
								this.alertService.error('Error al loguear el usuario empresa', 'OK');
							}
						);
					}
				},
				err => false
			)
		);
	}

	isLoggedIn() {
		this.tokenIsFresh.next(true);
		return localStorage.getItem('business') != null;
	}

	loginEmpresa(id: any): any {
		return this.http.post(this.config.apiUrl + '/auth/empresa/' + id, null).pipe(
			map(
				(response: any) => {
					const data = response.data;
					localStorage.setItem('token', data['token']);
					localStorage.setItem('role', 'providerAdmin');
					localStorage.setItem('roles', JSON.stringify(data['roles']));
					localStorage.setItem('user', JSON.stringify(data['user']));
					localStorage.setItem('businesses', JSON.stringify(data['businesses']));

					if (data['business']) {
						localStorage.setItem('business', JSON.stringify(data['business']));
					}
				},
				err => false
			)
		);
	}

	seleccionarEmpresa(formEmpresa) {
		return this.http
			.post(this.config.apiUrl + '/auth/empresa', formEmpresa)
			.pipe(map(data => localStorage.setItem('token', data['token']), err => false));
	}

	logout() {
		localStorage.clear();
		window.location.replace('/login');
	}

	getNombreEmpresa() {
		const empresa = JSON.parse(localStorage.getItem('business'));
		if (!empresa) return '';
		return empresa.nombre;
	}

	getNombreCompleto() {
		let ret = '';
		if (this.getNombre()) {
			ret += this.getNombre();
		}
		if (this.getApellido()) {
			ret += ' ' + this.getApellido();
		}
		return ret;
	}

	getNombre() {
		let nombre = JSON.parse(localStorage.getItem('user')).nombre;
		return nombre;
	}
	getApellido() {
		let apellido = JSON.parse(localStorage.getItem('user')).apellido;
		return apellido;
	}

	getEmail() {
		let email = JSON.parse(localStorage.getItem('user')).email;
		return email;
	}

	getIdUsuario() {
		let id = JSON.parse(localStorage.getItem('user')).id;
		return id;
	}

	reSendEmail(user) {
		return this.http.post(this.config.apiUrl + '/usuarios/enviarEmail', user).pipe(map(data => true, err => false));
	}

	register(formUsuario) {
		let usuario = {
			nombre: formUsuario.nombre,
			apellido: formUsuario.apellido,
			email: formUsuario.email
		};
		localStorage.setItem('user', JSON.stringify(usuario));
		return this.http.post(this.config.apiUrl + '/usuarios/registro', formUsuario);
	}

	canArray(roleArray: string[]) {
		let allRoles = localStorage.getItem('roles');
		let allRolesArray: String[] = JSON.parse(allRoles);
		var found = false;
		roleArray.forEach(role => {
			var index = allRolesArray.indexOf(role);
			if (index != -1) found = true;
		});
		return found;
	}

	can(role: string) {
		const allRoles = localStorage.getItem('roles');

		if (!allRoles) {
			return true;
		}

		const allRolesArray: String[] = JSON.parse(allRoles);
		return allRolesArray.includes(role);
	}

	openLoginDialog() {
		if (this.dialogService.dialog.openDialogs.length == 0) {
			const dialogRef = this.dialogService.openLogin(this.loginDialogData);
			this.loginDialogData.subscribe(response => {
				if (response) {
					let empresa = JSON.parse(localStorage.getItem('business'));
					let empresaId = 0;
					if (empresa != null || empresa != undefined) {
						empresaId = empresa.id;
					}
					this.loginExpired(response, empresaId).subscribe(
						data => {
							dialogRef.close();
						},
						error => {
							this.alertService.error('Usuario o contraseña incorrectos', 'OK');
						}
					);
				} else {
					dialogRef.close();
					this.logout();
				}
			});
		}
	}

	public collectFailedRequest(request: HttpRequest<any>): void {
		this.cachedRequests.push(request);
	}

	updateRequestArray(requests: Array<HttpRequest<any>>) {
		return requests.map(req => this.updateHeader(req));
	}

	updateHeader(request: HttpRequest<any>) {
		const token = localStorage.getItem('token');
		request = token ? request.clone({ setHeaders: { Authorization: 'Bearer ' + token } }) : request;
		return request;
	}
}
