import { Component, OnInit } from '@angular/core';
import { GruposService, AuthenticationService } from '../../services';

@Component({
	selector: 'business-groups-layout',
	templateUrl: './business-groups-layout.component.html',
	styleUrls: ['./business-groups-layout.component.scss']
})
export class BusinessGroupsLayoutComponent implements OnInit {
	loaderVisible: boolean = true;

	constructor(public groupsService: GruposService, private authenticationService: AuthenticationService) {
		this.groupsService.showGroup = false;
		this.groupsService.showList = true;
		this.groupsService.showCreate = false;
	}

	showList() {
		this.groupsService.showGroup = false;
		this.groupsService.showList = true;
		this.groupsService.showCreate = false;
	}
	ngOnInit() {
		this.groupsService.getLoaderVisibility().subscribe(data => {
			this.loaderVisible = data;
		});
	}
}
/*cargarGrupos() {
		this.groupsService.getGroups().subscribe(groups => {
			this.groupsService.groupsDatabase.updateGroups(groups);
			this.groups = this.groupsService.groupsDatabase.data;
		});
	} */
