import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminEditComponent } from './system-admin-edit.component';

describe('SystemAdminEditComponent', () => {
  let component: SystemAdminEditComponent;
  let fixture: ComponentFixture<SystemAdminEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemAdminEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAdminEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
