import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService, AlertService, GruposService, EmpresasService } from 'app/services';
import { Grupo, Empresa } from 'app/models';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'business-group-create',
	templateUrl: './business-groups.component.html',
	styleUrls: ['./business-groups.component.scss']
})
export class BusinessGroupsComponent implements OnInit {
	form: FormGroup;
	businesses: Array<Empresa>;
	selectedBusinesses: Array<Empresa>;

	progressButtonOptions: MatProgressButtonOptions = {
		active: false,
		text: 'Guardar',
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
		private formBuilder: FormBuilder,
		private alertService: AlertService,
		private authenticationService: AuthenticationService,
		private groupService: GruposService,
		private empresasService: EmpresasService
	) {}

	ngOnInit() {
		this.form = this.formBuilder.group({
			name: [undefined, [Validators.required]],
			description: [undefined, [Validators.required]]
		});
		this.loadBusinesses();
	}

	public createGroup(): void {
		if (!this.form.valid) {
			this.alertService.error('Los datos no son válidos.', 'OK');
		} else {
			this.progressButtonOptions.active = true;
			let newGroup = this.generateGroupFromForm();
			this.uploadBusinessGroup(newGroup);
		}
	}

	private generateGroupFromForm(): Grupo {
		let groupName = this.form.controls['name'].value;
		let groupDescription = this.form.controls['description'].value;
		let businessIdArray = this.createArrayOnlyIds(this.selectedBusinesses);
		return new Grupo(groupName, groupDescription, businessIdArray);
	}

	private uploadBusinessGroup(newGroup: Grupo): void {
		try {
			this.groupService.createGroup(newGroup).subscribe(
				data => this.manageCreateGroup(data),
				error => {
					const httpError = error as HttpErrorResponse;
					if (httpError.status == 401) {
						this.alertService.error('Debes iniciar sesión.', 'OK');
						this.authenticationService.logout();
					} else {
						this.alertService.error(error.error.message, 'OK');
					}
				},
				() => (this.progressButtonOptions.active = false)
			);
		} catch (e) {
			this.progressButtonOptions.active = false;
			this.alertService.error('Ocurrió un error.', 'OK');
		}
	}

	createArrayOnlyIds(array: Empresa[]): Array<Empresa> {
		var ret = Array<Empresa>();
		array.forEach(element => {
			var emp = new Empresa();
			emp.id = element.id;
			ret.push(emp);
		});
		return ret;
	}

	manageCreateGroup = (data: any) => {
		this.groupService.dataChange.emit(true);
		this.alertService.success('Grupo de Empresas Creado.', 'OK');
		this.groupService.showCreate = false;
		this.groupService.showList = true;
	};

	public showList(): void {
		this.groupService.showGroup = false;
		this.groupService.showList = true;
		this.groupService.showCreate = false;
		this.groupService.isEditing = false;
	}

	private loadBusinesses(): void {
		this.empresasService.getBusinesses().subscribe(empresas => {
			this.businesses = empresas;
			this.selectedBusinesses = [];
		});
	}

	public handleSelectedBusinessesChange(businesses: Empresa[]): void {
		this.selectedBusinesses = businesses;
	}
}
