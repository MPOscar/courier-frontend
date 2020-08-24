import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupermarketProductDetailComponent } from './supermarket-product-detail.component';

describe('SupermarketProductDetailComponent', () => {
  let component: SupermarketProductDetailComponent;
  let fixture: ComponentFixture<SupermarketProductDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupermarketProductDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupermarketProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
