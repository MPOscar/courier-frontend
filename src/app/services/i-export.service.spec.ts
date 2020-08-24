import { TestBed, inject } from '@angular/core/testing';

import { IExportService } from './i-export.service';

describe('IExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IExportService]
    });
  });

  it('should be created', inject([IExportService], (service: IExportService) => {
    expect(service).toBeTruthy();
  }));
});
