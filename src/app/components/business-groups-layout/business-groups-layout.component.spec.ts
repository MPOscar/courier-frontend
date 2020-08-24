import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessGroupsLayoutComponent } from './business-groups-layout.component';

describe('BusinessGroupsLayoutComponent', () => {
  let component: BusinessGroupsLayoutComponent;
  let fixture: ComponentFixture<BusinessGroupsLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessGroupsLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessGroupsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
