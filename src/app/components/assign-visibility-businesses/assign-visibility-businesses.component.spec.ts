import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVisibilityBusinessesComponent } from './assign-visibility-businesses.component';

describe('AssignVisibilityBusinessesComponent', () => {
  let component: AssignVisibilityBusinessesComponent;
  let fixture: ComponentFixture<AssignVisibilityBusinessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignVisibilityBusinessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVisibilityBusinessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
