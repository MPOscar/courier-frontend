import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderCatalogueComponent } from './provider-catalogue.component';

describe('ProviderCatalogueComponent', () => {
  let component: ProviderCatalogueComponent;
  let fixture: ComponentFixture<ProviderCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderCatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
