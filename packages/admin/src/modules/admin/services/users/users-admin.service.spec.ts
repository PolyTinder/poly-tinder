import { TestBed } from '@angular/core/testing';

import { UsersAdminService } from './users-admin.service';

describe('UsersAdminService', () => {
  let service: UsersAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
