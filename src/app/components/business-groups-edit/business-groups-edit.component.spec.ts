import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessGroupsEditComponent } from './business-groups-edit.component';

describe('BusinessGroupsEditComponent', () => {
  let component: BusinessGroupsEditComponent;
  let fixture: ComponentFixture<BusinessGroupsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessGroupsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessGroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
