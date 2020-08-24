import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoPalletComponent } from './producto-pallet.component';

describe('ProductoPalletComponent', () => {
  let component: ProductoPalletComponent;
  let fixture: ComponentFixture<ProductoPalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoPalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoPalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
