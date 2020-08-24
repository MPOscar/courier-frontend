import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { Empresa } from '../models/Empresa/Empresa';
import { Grupo } from '../models/Grupo/Grupo';
import { BehaviorSubject, throwError as _throw, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CatalogoResponse } from '../models/Catalogo/CatalogoResponse';
import { AppConfig } from '../app.config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GroupsDatabase } from '../data-sources';

@Directive()
@Injectable()
export class GruposService {
	public showGroup: boolean;
	public showList: boolean;
	public showCreate: boolean;

	public showGroupList: boolean;
	public showGroupEdit: boolean;
	public groupToEdit: Grupo;

	public fromWatch: boolean;
	private groupsSubject: BehaviorSubject<Grupo[]> = new BehaviorSubject([]);
	private groups: Grupo[] = [];

	@Output() dataChange: EventEmitter<boolean> = new EventEmitter();
	@Output() selectedGroupToEditDataChange: EventEmitter<Grupo> = new EventEmitter();

	groupsDatabase: GroupsDatabase;
	isEditing: boolean;

	private loaderVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);

	constructor(private http: HttpClient, private config: AppConfig) {
		this.groupsDatabase = new GroupsDatabase();
		this.http.get<CatalogoResponse>(this.config.apiUrl + '/grupos').subscribe(response => {
			if (response.code == 200) {
				var groupList = new Array<Grupo>();
				response.data.forEach(function(groupReceived) {
					var g = groupReceived;
					g.empresas = Array<Empresa>();
					g.listaEmpresas.forEach(function(businessFromGroup) {
						g.empresas.push(businessFromGroup);
					});
					groupList.push(g);
				});
				this.groups = groupList;
				this.groupsSubject.next(this.groups);
				this.groupsDatabase.updateGroups(this.groups);
				this.dataChange.emit(true);
				this.loaderVisibleSubject.next(false);
			}
		});
	}

	public cargarGrupos() {
		this.http.get<CatalogoResponse>(this.config.apiUrl + '/grupos').subscribe(response => {
			if (response.code == 200) {
				var groupList = new Array<Grupo>();
				response.data.forEach(function(groupReceived) {
					var g = groupReceived;
					g.empresas = Array<Empresa>();
					g.listaEmpresas.forEach(function(businessFromGroup) {
						g.empresas.push(businessFromGroup);
					});
					groupList.push(g);
				});
				this.groups = groupList;
				this.groupsSubject.next(this.groups);
				this.groupsDatabase.updateGroups(this.groups);
				this.dataChange.emit(true);
				this.loaderVisibleSubject.next(false);
			}
		});
	}

	public getGroups(): Observable<Grupo[]> {
		return this.groupsSubject.asObservable();
	}

	public getGroupById(groupId: number): Grupo {
		return this.groupsSubject.getValue().find(g => g.id == groupId);
	}
	//public getGroupById(): Grupo

	public getGroupsApi(): Observable<CatalogoResponse> {
		return this.http.get<CatalogoResponse>(this.config.apiUrl + '/grupos').pipe(catchError(this.handleError));
	}

	public createGroup(group: Grupo): Observable<Grupo> {
		return this.http.post<Grupo>(this.config.apiUrl + '/grupos', group).pipe(catchError(this.handleError));
	}

	public addGroupToLocalDb(group: Grupo) {
		var groupArray = this.groupsSubject.getValue();
		groupArray.push(group);
		this.groupsSubject.next(groupArray);
	}

	public getLoaderVisibility() {
		return this.loaderVisibleSubject.asObservable();
	}

	public setLoaderVisibility(state: boolean) {
		this.loaderVisibleSubject.next(state);
	}

	public editGroup(group: Grupo): Observable<Grupo> {
		return this.http.put<Grupo>(this.config.apiUrl + '/grupos', group).pipe(catchError(this.handleError));
	}

	public deleteGroup(group: Grupo): Observable<Grupo> {
		return this.http.delete<Grupo>(this.config.apiUrl + '/grupos/' + group.id).pipe(catchError(this.handleError));
	}

	public deleteGroupFromLocalDb(group: Grupo) {
		var groupArray = this.groupsSubject.getValue();
		groupArray = groupArray.filter(obj => obj.id !== group.id);
		this.groupsSubject.next(groupArray);
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
