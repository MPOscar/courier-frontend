import { TestBed, inject } from '@angular/core/testing';

import { SupermarketGuard } from './supermarket-guard';

describe('SupermarketGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupermarketGuard]
    });
  });

  it('should ...', inject([SupermarketGuard], (guard: SupermarketGuard) => {
    expect(guard).toBeTruthy();
  }));
});
