import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Neo4jAuth } from '../../models/core';
import { AppState, requestDialogOpen } from '../../store/core.store';
import { AppStorageService } from '../storage/app-storage.service';
import { Neo4jConnectionService } from './neo4j-connection.service';
import * as coreStore from '../../store/core.store';

const isLoggedOut = (status: boolean) => !status;

@Injectable({
  providedIn: 'root',
})
export class Neo4jAuthService {
  private initialized = false;

  constructor(
    private readonly storage: AppStorageService,
    private readonly store: Store<AppState>,
    private readonly neo4j: Neo4jConnectionService,
  ) {}

  tryLogin(auth: Neo4jAuth) {
    return this.neo4j.connect(auth);
  }

  init(getTimeFn = Date.now) {
    if (this.initialized) {
      return;
    }

    try {
      this.neo4j.connectStatus.subscribe((status) => {
        if (isLoggedOut(status)) {
          this.store.dispatch(coreStore.actions.updateAppStatus({ neo4jWorking: false }));
          this.openLoginForm(getTimeFn);
        } else {
          this.store.dispatch(coreStore.actions.updateAppStatus({ neo4jWorking: true }));
        }
      });

      const cache = this.storage.loadNeo4jAuth();
      if (cache) {
        this.tryLogin(cache).then().catch(); // cannot be thrown
      } else {
        this.openLoginForm(getTimeFn);
      }
    } finally {
      this.initialized = true;
    }
  }

  private openLoginForm(getTimeFn = Date.now) {
    this.store.dispatch(requestDialogOpen({ type: 'login', time: getTimeFn() }));
  }
}
