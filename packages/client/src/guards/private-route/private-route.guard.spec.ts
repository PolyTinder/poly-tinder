import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { privateRouteGuard } from './private-route.guard';

describe('privateRouteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => privateRouteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
