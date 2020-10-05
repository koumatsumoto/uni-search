import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState, requestLogin, requireLogin, selectLoginRequest } from '../../store/core.store';
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

  start(getTimeFn = Date.now) {
    const cache = this.storage.loadNeo4jAuth();

    if (cache) {
      this.store.dispatch(requestLogin(cache));
    } else {
      this.store.dispatch(requireLogin(getTimeFn()));
    }

    this.neo4jService.connectStatus.subscribe((status) => {
      if (!status) {
        this.store.dispatch(requireLogin(getTimeFn()));
      }
    });

    this.store.pipe(select(selectLoginRequest)).subscribe(async (auth) => {
      if (auth) {
        await this.neo4jService.connect(auth);
      }
    });
  }
}
