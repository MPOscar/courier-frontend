import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoInfoComponent } from './producto-info.component';

describe('ProductoInfoComponent', () => {
  let component: ProductoInfoComponent;
  let fixture: ComponentFixture<ProductoInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
