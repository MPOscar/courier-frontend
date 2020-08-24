import { TestBed, inject } from '@angular/core/testing';

import { ProviderExportService } from './provider-export.service';

describe('ProviderExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProviderExportService]
    });
  });

  it('should be created', inject([ProviderExportService], (service: ProviderExportService) => {
    expect(service).toBeTruthy();
  }));
});
