import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilitySingleBusinessEditComponent } from './visibility-single-business-edit.component';

describe('VisibilitySingleBusinessEditComponent', () => {
  let component: VisibilitySingleBusinessEditComponent;
  let fixture: ComponentFixture<VisibilitySingleBusinessEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibilitySingleBusinessEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibilitySingleBusinessEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
