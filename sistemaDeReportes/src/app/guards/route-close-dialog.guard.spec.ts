import { TestBed } from '@angular/core/testing';

import { RouteCloseDialogGuard } from './route-close-dialog.guard';

describe('RouteCloseDialogGuard', () => {
  let guard: RouteCloseDialogGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RouteCloseDialogGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
