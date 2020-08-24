import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVisibilityProductsComponent } from './assign-visibility-products.component';

describe('AssignVisibilityProductsComponent', () => {
  let component: AssignVisibilityProductsComponent;
  let fixture: ComponentFixture<AssignVisibilityProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignVisibilityProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVisibilityProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
