import { TestBed } from '@angular/core/testing';

import { RolesDashboardService } from './roles-dashboard.service';

describe('RolesDashboardService', () => {
  let service: RolesDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
