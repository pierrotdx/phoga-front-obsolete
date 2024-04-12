import { TestBed } from '@angular/core/testing';

import { PhogaSharedService } from './phoga-shared.service';

describe('PhogaSharedService', () => {
  let service: PhogaSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhogaSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
