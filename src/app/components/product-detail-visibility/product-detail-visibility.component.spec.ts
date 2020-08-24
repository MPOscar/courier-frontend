import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailVisibilityComponent } from './product-detail-visibility.component';

describe('ProductDetailVisibilityComponent', () => {
  let component: ProductDetailVisibilityComponent;
  let fixture: ComponentFixture<ProductDetailVisibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDetailVisibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
