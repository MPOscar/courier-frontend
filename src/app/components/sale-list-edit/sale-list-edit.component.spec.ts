import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleListEditComponent } from './sale-list-edit.component';

describe('SaleListEditComponent', () => {
  let component: SaleListEditComponent;
  let fixture: ComponentFixture<SaleListEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleListEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleListEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
