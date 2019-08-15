import { TestBed } from '@angular/core/testing';

import { MovesService } from './Moves.Service';

describe('MovesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MovesService = TestBed.get(MovesService);
    expect(service).toBeTruthy();
  });
});
