import { TestBed, inject } from '@angular/core/testing';

import { SaleListService } from './sale-list.service';

describe('SaleListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaleListService]
    });
  });

  it('should be created', inject([SaleListService], (service: SaleListService) => {
    expect(service).toBeTruthy();
  }));
});
