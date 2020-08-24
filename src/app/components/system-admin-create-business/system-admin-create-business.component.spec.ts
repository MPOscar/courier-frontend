import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminCreateBusinessComponent } from './system-admin-create-business.component';

describe('SystemAdminCreateBusinessComponent', () => {
  let component: SystemAdminCreateBusinessComponent;
  let fixture: ComponentFixture<SystemAdminCreateBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemAdminCreateBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAdminCreateBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
