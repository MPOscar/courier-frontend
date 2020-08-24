import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminUsersComponent } from './system-admin-users.component';

describe('SystemAdminUsersComponent', () => {
  let component: SystemAdminUsersComponent;
  let fixture: ComponentFixture<SystemAdminUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemAdminUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
