import { TestBed } from '@angular/core/testing';

import { Neo4jLoginManagerService } from './neo4j-login-manager.service';

describe('Neo4jLoginManagerService', () => {
  let service: Neo4jLoginManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Neo4jLoginManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
