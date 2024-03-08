import { TestBed } from '@angular/core/testing';

import { RESTAPIServiceYahtzeeService } from './restapiservice-yahtzee.service';

describe('RESTAPIServiceYahtzeeService', () => {
  let service: RESTAPIServiceYahtzeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RESTAPIServiceYahtzeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
