import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilityBusinessListComponent } from './visibility-business-list.component';

describe('VisibilityBusinessListComponent', () => {
  let component: VisibilityBusinessListComponent;
  let fixture: ComponentFixture<VisibilityBusinessListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibilityBusinessListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibilityBusinessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
