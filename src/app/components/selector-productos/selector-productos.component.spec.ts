import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorProductosComponent } from './selector-productos.component';

describe('SelectorProductosComponent', () => {
  let component: SelectorProductosComponent;
  let fixture: ComponentFixture<SelectorProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
