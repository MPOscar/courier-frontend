import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessGroupsListComponent } from './business-groups-list.component';

describe('BusinessGroupsListComponent', () => {
  let component: BusinessGroupsListComponent;
  let fixture: ComponentFixture<BusinessGroupsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessGroupsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
