import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorEmpresasTablaComponent } from './selector-empresas-tabla.component';

describe('SelectorEmpresasTablaComponent', () => {
  let component: SelectorEmpresasTablaComponent;
  let fixture: ComponentFixture<SelectorEmpresasTablaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorEmpresasTablaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorEmpresasTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
