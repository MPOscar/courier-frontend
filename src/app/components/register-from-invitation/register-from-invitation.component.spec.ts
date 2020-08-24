import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFromInvitationComponent } from './register-from-invitation.component';

describe('RegisterFromInvitationComponent', () => {
  let component: RegisterFromInvitationComponent;
  let fixture: ComponentFixture<RegisterFromInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterFromInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFromInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
