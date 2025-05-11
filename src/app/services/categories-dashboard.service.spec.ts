import { TestBed } from '@angular/core/testing';

import { CategoriesDashboardService } from './categories-dashboard.service';

describe('CategoriesDashboardService', () => {
  let service: CategoriesDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
