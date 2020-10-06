import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Neo4jAuth } from '../../models/core';
import { AppStorageService } from '../storage/app-storage.service';
import { Neo4jService } from './neo4j.service';

const isLoggedOutStatus = (status: boolean) => !status;

@Injectable({
  providedIn: 'root',
})
export class Neo4jLoginService {
  get loginRequest() {
    return this.loginRequest$.asObservable();
  }

  private readonly loginRequest$ = new ReplaySubject<number>(1);
  private initialized = false;

  constructor(private readonly storage: AppStorageService, private readonly neo4jService: Neo4jService) {}

  tryLogin(auth: Neo4jAuth) {
    return this.neo4jService.connect(auth);
  }

  init(getTimeFn = Date.now) {
    if (this.initialized) {
      return;
    }

    try {
      this.neo4jService.connectStatus.pipe(filter(isLoggedOutStatus)).subscribe(() => this.loginRequest$.next(getTimeFn()));

      const cache = this.storage.loadNeo4jAuth();
      if (cache) {
        this.tryLogin(cache).catch(); // cannot be thrown
      } else {
        this.loginRequest$.next(getTimeFn());
      }
    } finally {
      this.initialized = true;
    }
  }
}
