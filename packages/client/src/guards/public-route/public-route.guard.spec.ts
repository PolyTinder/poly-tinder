import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { publicRouteGuard } from './public-route.guard';

describe('publicRouteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => publicRouteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
