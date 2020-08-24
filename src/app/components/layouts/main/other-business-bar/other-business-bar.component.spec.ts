import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherBusinessBarComponent } from './other-business-bar.component';

describe('OtherBusinessBarComponent', () => {
  let component: OtherBusinessBarComponent;
  let fixture: ComponentFixture<OtherBusinessBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherBusinessBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherBusinessBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
