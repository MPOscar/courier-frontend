import {
	Component,
	ChangeDetectionStrategy,
	ViewChild,
	ViewContainerRef,
	TemplateRef,
	AfterViewInit,
	OnInit
} from '@angular/core';
import { AuthenticationService } from 'app/services';
import { Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from 'app/shared/services/sidenav.service';

@Component({
	templateUrl: 'main.component.html',
	styleUrls: ['main.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, AfterViewInit {
	@ViewChild('panel', { static: true }) private sidePanel: MatSidenav;
	@ViewChild('content', { static: true, read: ViewContainerRef }) private vcf: ViewContainerRef;
	@ViewChild('mobileNav', { static: true }) private mobileNav: TemplateRef<any>;

	public hasTemplate$: Observable<boolean> = this.sidenavService.hasTemplate.pipe();

	constructor(private authenticationService: AuthenticationService, public sidenavService: SidenavService) {}

	ngOnInit() {
		this.sidenavService.setPanel(this.sidePanel);
		this.sidenavService.setContentVcf(this.vcf);
	}

	ngAfterViewInit() {
		this.sidenavService.setTemplate(this.mobileNav);
	}

	get nombreEmpresa() {
		return this.authenticationService.getNombreEmpresa();
	}

	get nombreCompleto() {
		return this.authenticationService.getNombreCompleto();
	}
}
