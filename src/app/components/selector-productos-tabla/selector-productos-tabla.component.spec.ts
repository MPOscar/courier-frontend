import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorProductosTablaComponent } from './selector-productos-tabla.component';

describe('SelectorProductosTablaComponent', () => {
  let component: SelectorProductosTablaComponent;
  let fixture: ComponentFixture<SelectorProductosTablaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorProductosTablaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorProductosTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
