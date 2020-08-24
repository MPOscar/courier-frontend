import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderUserEditComponent } from './provider-user-edit.component';

describe('ProviderUserEditComponent', () => {
  let component: ProviderUserEditComponent;
  let fixture: ComponentFixture<ProviderUserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderUserEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
