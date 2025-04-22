import { TestBed } from '@angular/core/testing';

import { BarchartFilterService } from './barchart-filter.service';

describe('BarchartFilterService', () => {
  let service: BarchartFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarchartFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
