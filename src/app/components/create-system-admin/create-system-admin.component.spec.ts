import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSystemAdminComponent } from './create-system-admin.component';

describe('CreateSystemAdminComponent', () => {
  let component: CreateSystemAdminComponent;
  let fixture: ComponentFixture<CreateSystemAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSystemAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSystemAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
