import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState, requestNeo4jLogin, selectLoginFormValue } from '../../store/core.store';
import { AppStorageService } from '../storage/app-storage.service';
import { Neo4jService } from './neo4j.service';

@Injectable({
  providedIn: 'root',
})
export class Neo4jLoginManagerService {
  constructor(
    private readonly storage: AppStorageService,
    private readonly store: Store<AppState>,
    private readonly neo4jService: Neo4jService,
  ) {}

  start(time = Date.now()) {
    const cache = this.storage.loadNeo4jAuth();

    if (cache) {
      this.neo4jService.connect(cache);
    } else {
      this.store.dispatch(requestNeo4jLogin(time));
    }

    this.neo4jService.connectStatus.subscribe((status) => {
      if (!status) {
        this.storage.resetNeo4jAuth();
        this.store.dispatch(requestNeo4jLogin(Date.now()));
      }
    });

    this.store.pipe(select(selectLoginFormValue)).subscribe((auth) => {
      if (auth) {
        this.neo4jService.connect(auth);
      }
    });
  }
}
