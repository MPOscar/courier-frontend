import { TestBed, inject } from '@angular/core/testing';

import { TiendaInglesaExportService } from './tienda-inglesa-export.service';

describe('TiendaInglesaExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TiendaInglesaExportService]
    });
  });

  it('should be created', inject([TiendaInglesaExportService], (service: TiendaInglesaExportService) => {
    expect(service).toBeTruthy();
  }));
});
