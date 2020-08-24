import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleProductsComponent } from './visible-products.component';

describe('VisibleProductsComponent', () => {
	let component: VisibleProductsComponent;
	let fixture: ComponentFixture<VisibleProductsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [VisibleProductsComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VisibleProductsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
