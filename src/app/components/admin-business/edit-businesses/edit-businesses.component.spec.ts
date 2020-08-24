import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBusinessesComponent } from './edit-businesses.component';

describe('EditBusinessesComponent', () => {
  let component: EditBusinessesComponent;
  let fixture: ComponentFixture<EditBusinessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBusinessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBusinessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
