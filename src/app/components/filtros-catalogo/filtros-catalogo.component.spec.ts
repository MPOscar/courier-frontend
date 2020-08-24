import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosCatalogoComponent } from './filtros-catalogo.component';

describe('FiltrosCatalogoComponent', () => {
  let component: FiltrosCatalogoComponent;
  let fixture: ComponentFixture<FiltrosCatalogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosCatalogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
