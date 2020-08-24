import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderUsersComponent } from './provider-users.component';

describe('ProviderUsersComponent', () => {
  let component: ProviderUsersComponent;
  let fixture: ComponentFixture<ProviderUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
