import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVisibilityComponent } from './assign-visibility.component';

describe('AssignVisibilityComponent', () => {
  let component: AssignVisibilityComponent;
  let fixture: ComponentFixture<AssignVisibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignVisibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
