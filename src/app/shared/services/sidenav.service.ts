import { Injectable, ViewContainerRef, TemplateRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SidenavService {
	private panel: MatSidenav;
	private vcf: ViewContainerRef;
	private template: TemplateRef<any>;

	public hasTemplate = new BehaviorSubject<boolean>(false);

	constructor() {}

	private createView(template: TemplateRef<any>) {
		this.vcf.clear();
		this.vcf.createEmbeddedView(template);
	}

	setPanel = (sidenav: MatSidenav) => (this.panel = sidenav);
	setContentVcf = (viewContainerRef: ViewContainerRef) => (this.vcf = viewContainerRef);
	close = () => this.panel.close();
	toggle = () => this.panel.toggle();

	setTemplate = (template: TemplateRef<any>) => {
		this.template = template;
		this.hasTemplate.next(true);
	};

	open = () => {
		if (!this.template) {
			return;
		}

		this.createView(this.template);
		return this.panel.open();
	};
}
