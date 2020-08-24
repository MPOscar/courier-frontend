import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleListWatchComponent } from './sale-list-watch.component';

describe('SaleListWatchComponent', () => {
  let component: SaleListWatchComponent;
  let fixture: ComponentFixture<SaleListWatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleListWatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleListWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
