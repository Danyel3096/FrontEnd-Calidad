import { TestBed } from '@angular/core/testing';

import { ThemeEditorService } from './theme-editor.service';

describe('ThemeEditorService', () => {
  let service: ThemeEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
