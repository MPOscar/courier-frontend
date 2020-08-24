import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { AppConfig } from 'app/app.config';
import { map, catchError } from 'rxjs/operators';
import { Usuario } from 'app/models';
import { Observable, BehaviorSubject, throwError as _throw } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UsersDatabase } from 'app/data-sources';
import { CatalogoResponse } from 'app/models/Catalogo/CatalogoResponse';

@Directive()
@Injectable()
export class UsuariosService {
	public _usersDatabase: UsersDatabase;
	public showProviderUserList: boolean;
	public showCreateUser: boolean;
	public showProviderUserEdit: boolean;
	public userToEdit: Usuario = new Usuario();

	private usersSubject: BehaviorSubject<Usuario[]> = new BehaviorSubject([]);

	@Output() dataChange: EventEmitter<boolean> = new EventEmitter();

	constructor(private http: HttpClient, private config: AppConfig) {}

	get usersDatabase(): UsersDatabase {
		if (!this._usersDatabase) {
			this._usersDatabase = new UsersDatabase();
		}

		return this._usersDatabase;
	}

	public getUsersApi(): Observable<CatalogoResponse> {
		return this.http.get<CatalogoResponse>(this.config.apiUrl + '/usuarios').pipe(catchError(this.handleError));
	}

	public getSystemAdminUsersApi(): Observable<CatalogoResponse> {
		return this.http
			.get<CatalogoResponse>(this.config.apiUrl + '/usuarios/administradores')
			.pipe(catchError(this.handleError));
	}

	changePassword(codigo: string, usuario: Usuario): any {
		return this.http.put(this.config.apiUrl + '/usuarios/cambiarContrasena/' + codigo, usuario).pipe(
			map(
				(response: any) => {},
				err => {
					return false;
				}
			)
		);
	}

	cancelInvitation(usuario): Observable<Usuario> {
		const { _links, ...usuarioCancelar } = usuario;

		return this.http
			.post<Usuario>(this.config.apiUrl + '/usuarios/cancelarInvitacion', usuarioCancelar)
			.pipe(catchError(this.handleError));
	}

	cancelInvitationAdmin(usuario): Observable<Usuario> {
		return this.http
			.post<Usuario>(this.config.apiUrl + '/usuarios/cancelarInvitacionAdministrador', usuario)
			.pipe(catchError(this.handleError));
	}

	bajaDeEmpresa(user: Usuario): any {
		return this.http
			.delete<String>(this.config.apiUrl + '/usuarios/desvincular/' + user.id)
			.pipe(catchError(this.handleError));
	}

	eliminarAdministrador(user: Usuario): any {
		return this.http
			.delete<String>(this.config.apiUrl + '/usuarios/administradores/' + user.id)
			.pipe(catchError(this.handleError));
	}

	sendInvitation(usuario): Observable<Usuario> {
		return this.http
			.post<Usuario>(this.config.apiUrl + '/usuarios/enviarInvitacion', usuario)
			.pipe(catchError(this.handleError));
	}

	sendInvitationAdmin(usuario): Observable<Usuario> {
		return this.http
			.post<Usuario>(this.config.apiUrl + '/usuarios/enviarInvitacionAdministrador', usuario)
			.pipe(catchError(this.handleError));
	}

	inviteUser(usuario): Observable<Usuario> {
		return this.http
			.post<Usuario>(this.config.apiUrl + '/usuarios/invitar', usuario)
			.pipe(catchError(this.handleError));
	}

	inviteSystemAdmin(usuario): Observable<Usuario> {
		return this.http
			.post<Usuario>(this.config.apiUrl + '/usuarios/invitarAdministrador', usuario)
			.pipe(catchError(this.handleError));
	}

	registerFromInvitation(usuario: Usuario): any {
		return this.http
			.put<Usuario>(this.config.apiUrl + '/usuarios/completarInvitacion', usuario)
			.pipe(catchError(this.handleError));
	}

	updateUser(usuario: Usuario): any {
		return this.http.put<Usuario>(this.config.apiUrl + '/usuarios', usuario).pipe(catchError(this.handleError));
	}

	confirmarUsuario(codigo): Observable<String> {
		return this.http
			.put<String>(this.config.apiUrl + '/usuarios/confirmar/' + codigo, { code: codigo })
			.pipe(catchError(this.handleError));
	}

	aceptarInvitacion(codigo: string): any {
		return this.http
			.put<String>(this.config.apiUrl + '/usuarios/aceptarInvitacion/' + codigo, { codigo: codigo })
			.pipe(catchError(this.handleError));
	}

	cambiarRoles(usuario): Observable<Usuario> {
		return this.http
			.put<Usuario>(this.config.apiUrl + '/usuarios/cambiarPermisos/', usuario)
			.pipe(catchError(this.handleError));
	}

	enviarReseteoContraseña(usuario): Observable<Usuario> {
		return this.http
			.post<Usuario>(this.config.apiUrl + '/usuarios/solicitudReseteoContrasena/', usuario)
			.pipe(catchError(this.handleError));
	}

	enviarReseteoContraseñaPersonal(usuario): Observable<Usuario> {
		return this.http
			.post<Usuario>(this.config.apiUrl + '/usuarios/solicitudReseteoContrasenaPersonal/', usuario)
			.pipe(catchError(this.handleError));
	}

	public getProviderUsers(): Observable<Usuario[]> {
		return this.usersSubject.asObservable();
	}

	public addUserToLocalDb(user: Usuario) {
		var userArray = this.usersSubject.getValue();
		userArray.push(user);
		this.usersSubject.next(userArray);
	}

	public deleteUserFromLocalDb(user: Usuario) {
		var userArray = this.usersSubject.getValue();
		userArray = userArray.filter(obj => obj.id !== user.id);
		this.usersSubject.next(userArray);
	}
	private handleError(error: HttpErrorResponse) {
		console.log('error');
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
		}
		// return an observable with a user-facing error message
		return _throw(error);
	}
}
