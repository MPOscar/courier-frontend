import { TestBed, inject } from '@angular/core/testing';

import { TataExportService } from './tata-export.service';

describe('TataExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TataExportService]
    });
  });

  it('should be created', inject([TataExportService], (service: TataExportService) => {
    expect(service).toBeTruthy();
  }));
});
