import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteSalesListComponent } from './confirm-delete-sales-list.component';

describe('ConfirmDeleteSalesListComponent', () => {
  let component: ConfirmDeleteSalesListComponent;
  let fixture: ComponentFixture<ConfirmDeleteSalesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteSalesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteSalesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
