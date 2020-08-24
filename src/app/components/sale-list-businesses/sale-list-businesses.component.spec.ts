import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleListBusinessesComponent } from './sale-list-businesses.component';

describe('SaleListBusinessesComponent', () => {
  let component: SaleListBusinessesComponent;
  let fixture: ComponentFixture<SaleListBusinessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleListBusinessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleListBusinessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
