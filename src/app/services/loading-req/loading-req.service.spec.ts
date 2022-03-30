import { TestBed } from '@angular/core/testing';

import { LoadingReqService } from './loading-req.service';

describe('LoadingReqService', () => {
  let service: LoadingReqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingReqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
