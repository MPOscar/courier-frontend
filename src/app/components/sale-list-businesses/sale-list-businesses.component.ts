import { Component, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Empresa, Grupo } from 'app/models';
import { BusinessesDatabase, BusinessesDataSource } from 'app/data-sources';
import { ENTER } from '@angular/cdk/keycodes';
import { GruposService, EmpresasService, SaleListService } from 'app/services';
import { GroupBusinessesDatabase } from 'app/data-sources/group-business-database';
import { GroupBusinessesDataSource } from 'app/data-sources/group-business-data-source';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
	selector: 'sale-list-businesses',
	templateUrl: './sale-list-businesses.component.html',
	styleUrls: ['./sale-list-businesses.component.scss']
})
export class SaleListBusinessesComponent implements OnInit {
	//PAGINATORS
	@ViewChild('groupsPaginator', { static: true }) groupsPaginator: MatPaginator;
	@ViewChild('addedGroupsPaginator', { static: true }) addedGroupsPaginator: MatPaginator;
	@ViewChild('businessesPaginator', { static: true }) businessesPaginator: MatPaginator;
	@ViewChild('addedBusinessesPaginator', { static: true }) addedBusinessesPaginator: MatPaginator;

	//SORTS
	@ViewChild('addedBusinessesSort', { static: true }) addedBusinessesSort: MatSort;
	@ViewChild('businessesSort', { static: true }) businessesSort: MatSort;
	@ViewChild('groupsSort', { static: true }) groupsSort: MatSort;
	@ViewChild('addedGroupsSort', { static: true }) addedGroupsSort: MatSort;

	businesses: Array<Empresa>;
	businessGroups: Array<Grupo>;

	selectedValue: Empresa;
	businessesRadioButtonSelected: boolean = true;
	notSelectedBusinesses: Array<Empresa>;
	notSelectedGroups: Array<Grupo>;
	// Base de datos
	addedBusinessesDatabase: BusinessesDatabase;
	addedBusinessesDataSource: BusinessesDataSource | null;

	// Base de datos
	businessesDatabase: BusinessesDatabase;
	businessesDataSource: BusinessesDataSource | null;

	groupsDatabase: GroupBusinessesDatabase;
	groupsDataSource: GroupBusinessesDataSource | null;

	addedGroupsDatabase: GroupBusinessesDatabase;
	addedGroupsDataSource: GroupBusinessesDataSource | null;

	allBusinessGroups: Array<Grupo>;

	groupTableData: (Grupo | Empresa)[] = [];
	addedGroupTableData: (Grupo | Empresa)[] = [];

	displayedColumnsGroupsHeader = ['checkbox', 'tituloGrupo', 'nombre', 'razonSocial'];
	displayedColumnsBusinessesOfGroup = ['emptyCheckbox', 'tituloGrupo', 'nombre', 'razonSocial'];
	displayedColumnsGroup = ['checkbox', 'nombre'];

	// Propiedades de ayuda
	displayedColumns = ['nombre', 'rut', 'razonSocial', 'quitar'];
	displayedColumnsBusinesses = ['checkbox', 'nombre', 'rut', 'razonSocial'];
	displayedColumnsGroups = ['nombre', 'quitar'];
	separatorKeysCodes = [ENTER];
	inputFocused: boolean;
	detallesRow: number = 0;
	isProviderAdmin = false;
	matSelectText: String = '';

	businessesSelection = new SelectionModel<Empresa>(true, []); //decia grupo
	addedBusinessesSelection = new SelectionModel<Empresa>(true, []);
	groupsSelection = new SelectionModel<Grupo>(true, []);
	addedGroupsSelection = new SelectionModel<Grupo>(true, []);

	businessesToAdd: Empresa[] = new Array<Empresa>();
	groupsToAdd: Grupo[] = new Array<Grupo>();
	businessesToRemove: Empresa[] = new Array<Empresa>();
	groupsToRemove: Grupo[] = new Array<Grupo>();

	totalBusinessesLength = 0;
	totalGroupsLength = 0;
	addedBusinessesLength: number = 0;
	addedBusinessGroupsLength: number = 0;

	showAddedGroups = false;
	showAddedBusinesses = false;

	selectedFilters: string[] = [];
	selectedFiltersBusinesses: string[] = [];
	selectedFiltersGroups: string[] = [];

	constructor(
		private groupsService: GruposService,
		private empresasService: EmpresasService,
		private saleListService: SaleListService
	) {
		var role = localStorage.getItem('role');
		if (role == 'providerAdmin') {
			this.isProviderAdmin = true;
		}
		this.notSelectedBusinesses = new Array<Empresa>();
		this.notSelectedGroups = new Array<Grupo>();
	}

	ngOnInit() {
		this.initializeDataSources();
		this.cargarEmpresas();
		if (this.saleListService.showEdit) {
			this.cargarEmpresasEdit();
		}
	}

	initializeDataSources() {
		this.groupsDatabase = new GroupBusinessesDatabase();
		this.groupsDataSource = new GroupBusinessesDataSource(
			this.groupsDatabase,
			this.groupsPaginator,
			this.groupsSort
		);

		this.addedGroupsDatabase = new GroupBusinessesDatabase();
		this.addedGroupsDataSource = new GroupBusinessesDataSource(
			this.addedGroupsDatabase,
			this.addedGroupsPaginator,
			this.addedGroupsSort
		);

		this.groupsPaginator._intl.itemsPerPageLabel = 'Por página';
		this.groupsPaginator._intl.getRangeLabel = (page, size, length) =>
			`Pág. ${page + 1} de ${Math.ceil(length / size)}`;

		this.addedGroupsPaginator._intl.itemsPerPageLabel = 'Por página';
		this.addedGroupsPaginator._intl.getRangeLabel = (page, size, length) =>
			`Pág. ${page + 1} de ${Math.ceil(length / size)}`;

		this.addedBusinessesDatabase = new BusinessesDatabase();
		this.addedBusinessesDataSource = new BusinessesDataSource(
			this.addedBusinessesDatabase,
			this.addedBusinessesPaginator,
			this.addedBusinessesSort
		);

		this.businessesDatabase = new BusinessesDatabase();
		this.businessesDataSource = new BusinessesDataSource(
			this.businessesDatabase,
			this.businessesPaginator,
			this.businessesSort
		);

		this.businessesPaginator._intl.itemsPerPageLabel = 'Por página';
		this.businessesPaginator._intl.getRangeLabel = (page, size, length) =>
			`Pág. ${page + 1} de ${Math.ceil(length / size)}`;

		this.addedBusinessesPaginator._intl.itemsPerPageLabel = 'Por página';
		this.addedBusinessesPaginator._intl.getRangeLabel = (page, size, length) =>
			`Pág. ${page + 1} de ${Math.ceil(length / size)}`;
	}

	masterToggleGroups() {
		if (this.areAllGroupsSelected()) {
			this.groupsToAdd = new Array<Grupo>();
			this.groupsSelection.clear();
		} else {
			this.groupsDataSource.filteredData.forEach(group => {
				if (this.isGroup(0, group)) {
					this.groupsSelection.select(group);
					if (this.groupsToAdd.indexOf(group) == -1) this.groupsToAdd.push(group);
				}
			});
		}
	}
	masterToggleAddedGroups() {
		if (this.areAllAddedGroupsSelected()) {
			this.groupsToRemove = new Array<Grupo>();
			this.addedGroupsSelection.clear();
		} else {
			this.addedGroupsDataSource.filteredData.forEach(group => {
				if (this.isGroup(0, group)) {
					this.addedGroupsSelection.select(group);
					if (this.groupsToRemove.indexOf(group) == -1) this.groupsToRemove.push(group);
				}
			});
		}
	}
	masterToggleBusinesses() {
		if (this.areAllBusinessesSelected()) {
			this.businessesToAdd = new Array<Empresa>();
			this.businessesSelection.clear();
		} else {
			this.businessesDataSource.filteredData.forEach(business => {
				this.businessesSelection.select(business);
				if (this.businessesToAdd.indexOf(business) == -1) this.businessesToAdd.push(business);
			});
		}
	}
	masterToggleAddedBusinesses() {
		if (this.areAllAddedBusinessesSelected()) {
			this.businessesToRemove = new Array<Empresa>();
			this.addedBusinessesSelection.clear();
		} else {
			this.addedBusinessesDataSource.filteredData.forEach(business => {
				this.addedBusinessesSelection.select(business);
				if (this.businessesToRemove.indexOf(business) == -1) this.businessesToRemove.push(business);
			});
		}
	}

	areAllGroupsSelected() {
		const numSelected = this.groupsSelection.selected.length;
		const numRows = this.groupsDataSource.getFilteredGroups();
		return numSelected === numRows;
	}

	areAllAddedGroupsSelected() {
		const numSelected = this.addedGroupsSelection.selected.length;
		const numRows = this.addedGroupsDataSource.getFilteredGroups();
		return numSelected === numRows;
	}

	areAllBusinessesSelected() {
		const numSelected = this.businessesSelection.selected.length;
		const numRows = this.businessesDataSource.filteredData.length;
		return numSelected === numRows;
	}

	areAllAddedBusinessesSelected() {
		const numSelected = this.addedBusinessesSelection.selected.length;
		const numRows = this.addedBusinessesDataSource.filteredData.length;
		return numSelected === numRows;
	}

	addGroup(g: any) {
		this.groupsSelection.toggle(g);
		var group = g as Grupo;
		if (this.groupsToAdd.indexOf(group) == -1) this.groupsToAdd.push(group);
		else this.groupsToAdd.splice(this.groupsToAdd.indexOf(group), 1);
	}

	removeGroupFromAdded(g: any) {
		this.addedGroupsSelection.toggle(g);
		var group = g as Grupo;
		if (this.groupsToRemove.indexOf(group) == -1) this.groupsToRemove.push(group);
		else this.groupsToRemove.splice(this.groupsToRemove.indexOf(group), 1);
	}

	addBusiness(b: any) {
		this.businessesSelection.toggle(b);
		var business = b as Empresa;
		if (this.businessesToAdd.indexOf(business) == -1) this.businessesToAdd.push(business);
		else this.businessesToAdd.splice(this.businessesToAdd.indexOf(business), 1);
	}

	removeBusinessFromAdded(b: any) {
		this.addedBusinessesSelection.toggle(b);
		var business = b as Empresa;
		if (this.businessesToRemove.indexOf(business) == -1) this.businessesToRemove.push(business);
		else this.businessesToRemove.splice(this.businessesToRemove.indexOf(business), 1);
	}

	addGroups() {
		this.groupsSelection.clear();
		this.groupsToAdd.forEach(group => {
			this.addGroupToVisible(group);
		});
		this.groupsToAdd = new Array<Empresa>();
		this.addedBusinessGroupsLength = this.addedGroupsDatabase.data.length;
		if (this.addedBusinessGroupsLength == 0) {
			this.showAddedGroups = false;
		} else this.showAddedGroups = true;
	}

	removeGroups() {
		this.addedGroupsSelection.clear();
		this.groupsToRemove.forEach(group => {
			this.removeGroupFromVisible(group);
		});
		this.groupsToRemove = new Array<Grupo>();
		this.addedBusinessGroupsLength = this.addedGroupsDatabase.data.length;
		if (this.addedBusinessGroupsLength == 0) {
			this.showAddedGroups = false;
		} else this.showAddedGroups = true;
	}

	addBusinesses() {
		this.businessesSelection.clear();
		this.businessesToAdd.forEach(business => {
			this.addBusinessToVisible(business);
		});
		this.addedBusinessesLength = this.businessesToAdd.length;
		this.businessesToAdd = new Array<Empresa>();
		if (this.addedBusinessesLength == 0) {
			this.showAddedBusinesses = false;
		} else this.showAddedBusinesses = true;
	}

	removeBusinesses() {
		this.addedBusinessesSelection.clear();
		this.businessesToRemove.forEach(business => {
			this.removeFromVisible(business);
		});
		this.addedBusinessesLength = this.businessesToRemove.length;
		if (this.addedBusinessesLength == 0) {
			this.showAddedBusinesses = false;
		} else this.showAddedBusinesses = true;
		this.businessesToRemove = new Array<Empresa>();
	}

	isGroup(index, item): boolean {
		return item.descripcion != undefined;
	}

	cargarEmpresasEdit() {
		this.saleListService.listToEdit.empresas.forEach(empresa => {
			this.addBusinessToVisible(empresa);
		});
		this.addedBusinessesLength = this.saleListService.listToEdit.empresas.length;
		if (this.addedBusinessesLength == 0) {
			this.showAddedBusinesses = false;
		} else this.showAddedBusinesses = true;
		this.saleListService.listToEdit.grupos.forEach(grupo => {
			this.addGroupToVisible(grupo);
		});
		this.addedBusinessGroupsLength = this.addedGroupsDatabase.data.length;
		if (this.addedBusinessGroupsLength == 0) {
			this.showAddedGroups = false;
		} else this.showAddedGroups = true;
	}
	changeRadioButton() {
		this.businessesRadioButtonSelected = !this.businessesRadioButtonSelected;
		this.changeFilters();
	}

	cargarEmpresas() {
		this.empresasService.getBusinesses().subscribe(empresas => {
			this.businesses = empresas;
			this.notSelectedBusinesses = empresas;
			this.businessesDatabase.updateBusinesses(this.notSelectedBusinesses);
			this.totalBusinessesLength = this.businessesDatabase.data.length;
			this.cargarGruposDeEmpresas();
		});
	}

	cargarGruposDeEmpresas() {
		this.groupsService.getGroups().subscribe(grupos => {
			this.businessGroups = grupos;
			this.notSelectedGroups = grupos;
			this.groupTableData = [];
			this.addedGroupTableData = [];

			grupos.forEach(grupo => {
				this.groupTableData.push(grupo);
				grupo.empresas.forEach(empresa => {
					this.groupTableData.push(empresa);
				});
			});
			this.totalGroupsLength = this.groupsDatabase.data.length;
			this.groupsDatabase.updateElement(this.groupTableData);
		});
	}

	removeGroupFromVisible(group: any) {
		if (group != null && this.isGroup(1, group)) {
			var existingGroup: Grupo = this.addedGroupsDatabase.data.find(g => g.id == group.id && this.isGroup(1, g));
			if (existingGroup != null) {
				this.groupTableData.push(existingGroup);
				var existingGroupIndex = this.addedGroupTableData.indexOf(existingGroup);
				this.addedGroupTableData.splice(existingGroupIndex, 1);
				existingGroup.empresas.forEach(empresa => {
					this.groupTableData.push(empresa);
					var existingBusinessIndex = this.addedGroupTableData.indexOf(empresa);
					this.addedGroupTableData.splice(existingBusinessIndex, 1);
				});
				this.groupsDatabase.updateElement(this.groupTableData);

				var groupsToAdd: Grupo[] = [];
				this.addedGroupsDatabase.data.forEach(grupo => {
					if (this.isGroup(1, grupo)) {
						groupsToAdd.push(grupo);
					}
				});

				this.saleListService.groups = groupsToAdd;
				this.addedGroupsDatabase.updateElement(this.addedGroupTableData);
				if (this.saleListService.businesses.length > 0 || this.saleListService.groups.length > 0) {
					this.saleListService.secondStepDone = true;
				} else {
					this.saleListService.secondStepDone = false;
				}
				this.addedBusinessGroupsLength = this.addedGroupsDatabase.data.length;
				this.totalGroupsLength = this.groupsDatabase.data.length;
			}
		}
	}
	addGroupToVisible(group: any) {
		if (group != null && this.isGroup(1, group)) {
			var existingGroup: Grupo = this.groupsDatabase.data.find(g => g.id == group.id && this.isGroup(1, g));
			if (existingGroup != null) {
				this.addedGroupTableData.push(existingGroup);
				var existingGroupIndex = this.groupTableData.indexOf(existingGroup);
				this.groupTableData.splice(existingGroupIndex, 1);
				existingGroup.empresas.forEach(empresa => {
					this.addedGroupTableData.push(empresa);
					var existingBusinessIndex = this.groupTableData.indexOf(empresa);
					this.groupTableData.splice(existingBusinessIndex, 1);
				});
				this.groupsDatabase.updateElement(this.groupTableData);
				this.addedGroupsDatabase.updateElement(this.addedGroupTableData);

				var groupsToAdd: Grupo[] = [];
				this.addedGroupsDatabase.data.forEach(grupo => {
					if (this.isGroup(1, grupo)) {
						groupsToAdd.push(grupo);
					}
				});

				this.saleListService.groups = groupsToAdd;

				if (this.saleListService.businesses.length > 0 || this.saleListService.groups.length > 0) {
					this.saleListService.secondStepDone = true;
				} else {
					this.saleListService.secondStepDone = false;
				}
				this.addedBusinessGroupsLength = this.addedGroupsDatabase.data.length;
				this.totalGroupsLength = this.groupsDatabase.data.length;
			}
		}
	}

	addBusinessToVisible(business: any) {
		if (business != null) {
			var emp = this.addedBusinessesDatabase.data.find(b => b.id == business.id);
			if (emp == null) {
				this.addedBusinessesDatabase.addBusiness(business);
				var empArray = this.notSelectedBusinesses;
				this.notSelectedBusinesses = empArray.filter(b => b.id != business.id);
				this.businessesDatabase.updateBusinesses(this.notSelectedBusinesses);

				this.saleListService.businesses = this.addedBusinessesDatabase.data;
			}
			if (this.saleListService.businesses.length > 0 || this.saleListService.groups.length > 0) {
				this.saleListService.secondStepDone = true;
			} else {
				this.saleListService.secondStepDone = false;
			}
			this.addedBusinessesLength = this.addedBusinessesDatabase.data.length;
			this.totalBusinessesLength = this.businessesDatabase.data.length;
		}
	}

	removeFromVisible(business: any) {
		this.addedBusinessesDatabase.removeBusiness(business);
		this.notSelectedBusinesses.push(business);

		if (this.businessesRadioButtonSelected) {
			this.businessesDatabase.updateBusinesses(this.notSelectedBusinesses);
		}
		this.saleListService.businesses = this.addedBusinessesDatabase.data;
		if (this.saleListService.businesses.length > 0 || this.saleListService.groups.length > 0) {
			this.saleListService.secondStepDone = true;
		} else {
			this.saleListService.secondStepDone = false;
		}
		this.addedBusinessesLength = this.addedBusinessesDatabase.data.length;
		this.totalBusinessesLength = this.businessesDatabase.data.length;
	}

	saveVisibility() {}
	loadBusinessGroups() {
		this.groupsService.getGroupsApi().subscribe(response => {
			this.businessGroups = response.data;
		});
	}

	changeFilters() {
		this.selectedFilters.splice(0, this.selectedFilters.length);
		if (this.businessesRadioButtonSelected) {
			this.selectedFilters = this.selectedFiltersBusinesses.slice();
			this.businessesDataSource.filter = this.selectedFilters;
		} else {
			this.selectedFilters = this.selectedFiltersGroups.slice();
			this.groupsDataSource.filter = this.selectedFilters;
		}
	}
	removeFilter(filter) {
		if (this.businessesRadioButtonSelected) {
			this.selectedFiltersBusinesses.splice(this.selectedFiltersBusinesses.indexOf(filter), 1);
			this.selectedFilters = this.selectedFiltersBusinesses.slice();
			this.businessesDataSource.filter = this.selectedFilters;
		} else {
			this.selectedFiltersGroups.splice(this.selectedFiltersGroups.indexOf(filter), 1);
			this.selectedFilters = this.selectedFiltersGroups.slice();
			this.groupsDataSource.filter = this.selectedFilters;
		}
	}
	addFiltro(event: MatChipInputEvent): void {
		let input = event.input;
		let value = event.value;
		if (value.trim() != '') {
			if ((value || '').trim()) {
				if (this.businessesRadioButtonSelected) {
					this.selectedFiltersBusinesses.push(value.trim());
					this.selectedFilters = this.selectedFiltersBusinesses.slice();
					this.businessesDataSource.filter = this.selectedFilters;
				} else {
					this.selectedFiltersGroups.push(value.trim());
					this.selectedFilters = this.selectedFiltersGroups.slice();
					this.groupsDataSource.filter = this.selectedFilters;
				}
				//	this.productsDataSource.filter = this.selectedFilters;
			}

			if (input) {
				input.value = '';
			}
		}
	}
}
