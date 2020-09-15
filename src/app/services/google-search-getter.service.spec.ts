import { TestBed } from '@angular/core/testing';

import { GoogleSearchGetterService } from './google-search-getter.service';

describe('GoogleSearchGetterService', () => {
  let service: GoogleSearchGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleSearchGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
