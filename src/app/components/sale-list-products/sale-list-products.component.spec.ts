import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleListProductsComponent } from './sale-list-products.component';

describe('SaleListProductsComponent', () => {
  let component: SaleListProductsComponent;
  let fixture: ComponentFixture<SaleListProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleListProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleListProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
