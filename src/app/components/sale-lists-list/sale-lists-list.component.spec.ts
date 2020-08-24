import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleListsListComponent } from './sale-lists-list.component';

describe('SaleListsListComponent', () => {
  let component: SaleListsListComponent;
  let fixture: ComponentFixture<SaleListsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleListsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleListsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
