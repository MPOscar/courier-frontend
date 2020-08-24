import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilityLayoutComponent } from './visibility-layout.component';

describe('VisibilityLayoutComponent', () => {
  let component: VisibilityLayoutComponent;
  let fixture: ComponentFixture<VisibilityLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibilityLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibilityLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
