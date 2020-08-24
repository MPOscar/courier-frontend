import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSingleBusinessComponent } from './edit-single-business.component';

describe('EditSingleBusinessComponent', () => {
  let component: EditSingleBusinessComponent;
  let fixture: ComponentFixture<EditSingleBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSingleBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSingleBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
