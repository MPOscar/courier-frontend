import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessGroupsComponent } from './business-groups.component';

describe('BusinessGroupsComponent', () => {
  let component: BusinessGroupsComponent;
  let fixture: ComponentFixture<BusinessGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
