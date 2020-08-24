import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoCategoriaGpcComponent } from './producto-categoria-gpc.component';

describe('ProductoPalletComponent', () => {
  let component: ProductoCategoriaGpcComponent;
  let fixture: ComponentFixture<ProductoCategoriaGpcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoCategoriaGpcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoCategoriaGpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
