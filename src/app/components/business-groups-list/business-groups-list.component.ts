import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { GroupsDataSource, GroupsDatabase } from 'app/data-sources';
import { Grupo } from 'app/models';
import { AlertService, AuthenticationService, GruposService } from 'app/services';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from 'app/services/dialog.service';
import { DialogData } from 'app/models/DialogData/DialogData';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

@Component({
	selector: 'business-groups-list',
	templateUrl: './business-groups-list.component.html',
	styleUrls: ['./business-groups-list.component.scss']
})
export class BusinessGroupsListComponent implements OnInit {
	@Input() group;

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	groupsSubscription: Subscription;
	dataSource: GroupsDataSource | null;
	groupsDatabase: GroupsDatabase;
	groups: Grupo[];
	groupsLength = 0;

	// Propiedades de ayuda
	displayedColumns = ['nombre', 'descripcion', 'quitar'];
	showCreateBusinessGroups = true;
	canEdit = false;

	progressButtonOptions: MatProgressButtonOptions = {
		active: false,
		text: 'Crear',
		spinnerSize: 18,
		raised: true,
		stroked: false,
		buttonColor: 'primary',
		spinnerColor: 'primary',
		fullWidth: false,
		disabled: false,
		mode: 'indeterminate'
	};

	constructor(
		public groupService: GruposService,
		private alertService: AlertService,
		private authenticationService: AuthenticationService,
		private dialogService: DialogService
	) {
		this.loadGroups();
		this.groupsDatabase = groupService.groupsDatabase;
		if (
			this.authenticationService.can('crearGruposDeEmpresa') ||
			this.authenticationService.can('administradorEmpresa')
		) {
			this.showCreateBusinessGroups = true;
		} else {
			this.showCreateBusinessGroups = false;
		}
	}

	loadGroups() {
		this.groups = this.groupService.groupsDatabase.data;
		this.groupsLength = this.groups.length;
	}

	ngOnInit() {
		this.loadGroups();
		this.groupService.dataChange.subscribe(changed => {
			if (changed) {
				this.loadGroups();
			}
		});
		this.initializeVariables();
	}

	initializeVariables() {
		if (
			this.authenticationService.can('crearGruposDeEmpresa') ||
			this.authenticationService.can('administradorEmpresa')
		) {
			this.canEdit = true;
		} else this.canEdit = false;
		this.dataSource = new GroupsDataSource(this.groupsDatabase, this.paginator, this.sort);

		this.paginator._intl.itemsPerPageLabel = 'Por página';
		this.paginator._intl.getRangeLabel = (page, size, length) => `Pág. ${page + 1} de ${Math.ceil(length / size)}`;
	}

	openDeleteDialog(groupToDelete): void {
		let dialogData = new DialogData();
		dialogData.title = 'Eliminar Grupo de Empresas';
		dialogData.content = '¿Seguro que desea eliminar el grupo ' + groupToDelete.nombre + '?';
		dialogData.type = 'warn';
		dialogData.acceptButtonText = 'Eliminar';
		const dialogRef = this.dialogService.open(dialogData);
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.deleteGroup(groupToDelete);
			}
		});
	}

	manageDeleteGroup(group): any {
		this.groupService.groupsDatabase.deleteGroup(group);
		this.groupService.deleteGroupFromLocalDb(group);
		this.groupService.dataChange.emit(true);
		this.alertService.success('Grupo de Empresas Eliminado.', 'OK');
	}

	deleteGroup(group) {
		this.progressButtonOptions.active = true;

		try {
			this.groupService.deleteGroup(group).subscribe(
				data => {
					this.manageDeleteGroup(group);
				},
				error => {
					var httpError = error as HttpErrorResponse;
					if (httpError.status == 401) {
						this.alertService.error('Debes iniciar sesión.', 'OK');
						this.authenticationService.logout();
					} else {
						this.alertService.error('Ocurrió un error: ' + httpError.error.message, 'OK');
					}
				},
				() => (this.progressButtonOptions.active = false)
			);
		} catch (e) {
			this.progressButtonOptions.active = false;
			this.alertService.error('Ocurrió un error.', 'OK');
		}
	}
	editGroup(group) {
		this.groupService.showGroup = true;
		this.groupService.showList = false;
		this.groupService.showCreate = false;
		this.groupService.groupToEdit = group;
		this.groupService.isEditing = true;
	}
	watchGroup(group) {
		this.groupService.showGroup = true;
		this.groupService.showList = false;
		this.groupService.showCreate = false;
		this.groupService.groupToEdit = group;
		this.groupService.isEditing = false;
	}
	showCreate() {
		this.groupService.showGroup = false;
		this.groupService.showList = false;
		this.groupService.showCreate = true;
		this.groupService.isEditing = false;
	}
}
