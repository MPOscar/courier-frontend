import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BussisnesWithVisibilityComponent } from './bussisnes-with-visibility.component';

describe('ProviderListComponent', () => {
	let component: BussisnesWithVisibilityComponent;
	let fixture: ComponentFixture<BussisnesWithVisibilityComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BussisnesWithVisibilityComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BussisnesWithVisibilityComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
