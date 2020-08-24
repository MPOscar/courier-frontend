import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilitySingleBusinessComponent } from './visibility-single-business.component';

describe('VisibilitySingleBusinessComponent', () => {
  let component: VisibilitySingleBusinessComponent;
  let fixture: ComponentFixture<VisibilitySingleBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibilitySingleBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibilitySingleBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
