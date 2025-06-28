import { TestBed } from '@angular/core/testing';

import { CustomFilterService } from './custom-filter.service';

describe('CustomFilterService', () => {
  let service: CustomFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
