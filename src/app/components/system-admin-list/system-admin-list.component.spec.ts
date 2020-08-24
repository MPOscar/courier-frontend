import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminListComponent } from './system-admin-list.component';

describe('SystemAdminListComponent', () => {
  let component: SystemAdminListComponent;
  let fixture: ComponentFixture<SystemAdminListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemAdminListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
