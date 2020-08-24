import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminListBusinessesComponent } from './system-admin-list-businesses.component';

describe('SystemAdminListBusinessesComponent', () => {
  let component: SystemAdminListBusinessesComponent;
  let fixture: ComponentFixture<SystemAdminListBusinessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemAdminListBusinessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAdminListBusinessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
