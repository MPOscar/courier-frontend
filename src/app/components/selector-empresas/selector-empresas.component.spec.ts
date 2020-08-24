import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorEmpresasComponent } from './selector-empresas.component';

describe('SelectorEmpresasComponent', () => {
  let component: SelectorEmpresasComponent;
  let fixture: ComponentFixture<SelectorEmpresasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorEmpresasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
