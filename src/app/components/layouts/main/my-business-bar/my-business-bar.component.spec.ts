import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBusinessBarComponent } from './my-business-bar.component';

describe('MyBusinessBarComponent', () => {
  let component: MyBusinessBarComponent;
  let fixture: ComponentFixture<MyBusinessBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBusinessBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBusinessBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
