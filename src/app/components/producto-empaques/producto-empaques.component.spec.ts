import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoEmpaquesComponent } from './producto-empaques.component';

describe('ProductoEmpaquesComponent', () => {
  let component: ProductoEmpaquesComponent;
  let fixture: ComponentFixture<ProductoEmpaquesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoEmpaquesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoEmpaquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
