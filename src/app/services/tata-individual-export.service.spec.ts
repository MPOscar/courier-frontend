import { TestBed, inject } from '@angular/core/testing';

import { TataIndividualExportService } from './tata-individual-export.service';

describe('TataIndividualExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TataIndividualExportService]
    });
  });

  it('should be created', inject([TataIndividualExportService], (service: TataIndividualExportService) => {
    expect(service).toBeTruthy();
  }));
});
