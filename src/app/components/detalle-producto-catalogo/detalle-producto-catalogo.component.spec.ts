import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProductoCatalogoComponent } from './detalle-producto-catalogo.component';

describe('DetalleProductoCatalogoComponent', () => {
  let component: DetalleProductoCatalogoComponent;
  let fixture: ComponentFixture<DetalleProductoCatalogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleProductoCatalogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleProductoCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
