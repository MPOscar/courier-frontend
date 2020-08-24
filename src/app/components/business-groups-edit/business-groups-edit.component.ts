import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empresa, Grupo } from '../../models';
import { AlertService, AuthenticationService, EmpresasService, GruposService } from '../../services';
import { Subscription } from 'rxjs';

@Component({
	selector: 'business-groups-edit',
	templateUrl: './business-groups-edit.component.html',
	styleUrls: ['./business-groups-edit.component.scss']
})
export class BusinessGroupsEditComponent implements OnInit, AfterViewInit, OnDestroy {
	form: FormGroup;
	businesses: Empresa[] = [];
	selectedBusinesses: Empresa[] = [];
	group: Grupo;
	empresasSubscription: Subscription;
	groupsSubscription: Subscription;

	constructor(
		private empresasService: EmpresasService,
		public groupsService: GruposService,
		private authenticationService: AuthenticationService,
		private alertService: AlertService,
		private formBuilder: FormBuilder
	) {}

	ngOnInit() {
		this.group = this.groupsService.groupToEdit;
		this.setForm();
		this.setFields();
		this.loadAllBusinesses();
	}

	ngAfterViewInit() {
		this.selectedBusinesses = this.group.empresas;
	}

	ngOnDestroy() {
		if (this.empresasSubscription !== undefined) this.empresasSubscription.unsubscribe();
		if (this.groupsSubscription !== undefined) this.groupsSubscription.unsubscribe();
	}

	private setForm() {
		this.form = this.formBuilder.group({
			name: [{ value: undefined, disabled: !this.groupsService.isEditing }, [Validators.required]],
			description: [{ value: undefined, disabled: !this.groupsService.isEditing }, [Validators.required]]
		});
	}

	private setFields() {
		this.form.controls['name'].setValue(this.group.nombre);
		this.form.controls['description'].setValue(this.group.descripcion);
	}

	private loadAllBusinesses(): void {
		if (this.groupsService.isEditing) {
			this.empresasSubscription = this.empresasService.getBusinesses().subscribe(empresas => {
				this.businesses = empresas;
			});
		}
	}

	public saveGroup(): void {
		if (!this.form.valid) {
			this.alertService.error('Los datos no son válidos.', 'OK');
		} else {
			let newGroup = this.generateGroupFromForm();
			newGroup.id = this.group.id;
			this.uploadBusinessGroup(newGroup);
		}
	}

	private generateGroupFromForm(): Grupo {
		var groupName = this.form.controls['name'].value;
		let groupDescription = this.form.controls['description'].value;
		let arrayOnlyBusinessIds = this.createArrayOnlyIds(this.selectedBusinesses);
		return new Grupo(groupName, groupDescription, arrayOnlyBusinessIds);
	}

	private uploadBusinessGroup(newGroup: Grupo): void {
		try {
			this.groupsSubscription = this.groupsService.editGroup(newGroup).subscribe(
				data => {
					this.manageEditGroup(data);
				},
				error => {
					var httpError = error as HttpErrorResponse;
					if (httpError.status == 401) {
						this.alertService.error('Debes iniciar sesión.', 'OK');
						this.authenticationService.logout();
					} else {
						this.alertService.error('Ocurrió un error.', 'OK');
					}
				}
			);
		} catch (e) {
			this.alertService.error('Ocurrió un error.', 'OK');
		}
	}

	private createArrayOnlyIds(array: Empresa[]): Array<Empresa> {
		var ret = Array<Empresa>();
		array.forEach(element => {
			var emp = new Empresa();
			emp.id = element.id;
			ret.push(emp);
		});
		return ret;
	}

	manageEditGroup = (data: any) => {
		var createdGroup = data.data as Grupo;
		this.groupsService.groupToEdit = createdGroup;
		this.groupsService.dataChange.emit(true);
		this.alertService.success('Grupo de Empresas Editado.', 'OK');
		this.groupsService.showCreate = false;
		this.groupsService.showGroup = false;
		this.groupsService.showList = true;
	};

	public handleSelectedBusinessesChange(businesses: Empresa[]): void {
		this.selectedBusinesses = businesses;
	}
}
