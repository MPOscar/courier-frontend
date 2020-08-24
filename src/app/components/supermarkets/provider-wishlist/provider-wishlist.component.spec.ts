import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderWishlistComponent } from './provider-wishlist.component';

describe('ProviderWishlistComponent', () => {
  let component: ProviderWishlistComponent;
  let fixture: ComponentFixture<ProviderWishlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderWishlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
