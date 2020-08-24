import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesCompraComponent } from './ordenes-compra.component';

describe('OrdenesCompraComponent', () => {
  let component: OrdenesCompraComponent;
  let fixture: ComponentFixture<OrdenesCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenesCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
