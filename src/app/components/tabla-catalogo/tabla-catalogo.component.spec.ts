import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCatalogoComponent } from './tabla-catalogo.component';

describe('TablaCatalogoComponent', () => {
  let component: TablaCatalogoComponent;
  let fixture: ComponentFixture<TablaCatalogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaCatalogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
