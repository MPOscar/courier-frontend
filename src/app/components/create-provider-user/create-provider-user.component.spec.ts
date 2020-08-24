import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProviderUserComponent } from './create-provider-user.component';

describe('CreateProviderUserComponent', () => {
  let component: CreateProviderUserComponent;
  let fixture: ComponentFixture<CreateProviderUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProviderUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProviderUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
