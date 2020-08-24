import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-menu',
	templateUrl: 'menu.component.html',
	styleUrls: ['menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {
	constructor(private router: Router) {}

	ngOnInit() {}

	public goTo(route) {
		this.router.navigate(route);
	}
}
