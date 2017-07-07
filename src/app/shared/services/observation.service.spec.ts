import { TestBed, inject } from '@angular/core/testing';

import { ObservationService } from './observation.service';

describe('ObservationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObservationService]
    });
  });

  it('should ...', inject([ObservationService], (service: ObservationService) => {
    expect(service).toBeTruthy();
  }));
});
