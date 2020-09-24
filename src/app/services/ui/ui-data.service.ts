import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Neo4jAuth } from '../../models/core';
import * as coreStore from '../../store/core.store';
import { AppState } from '../../store/core.store';
import { GoogleSearchService } from '../google/google-search.service';
import { AppStorageService } from '../storage/app-storage.service';

const isNotNull = <T>(value: T | null): value is T => value !== null;

@Injectable({
  providedIn: 'root',
})
export class UiDataService {
  get command() {
    return this.store.pipe(select(coreStore.selectCommand));
  }

  get searchResults() {
    return this.store.pipe(select(coreStore.selectSearchResults), filter(isNotNull));
  }

  get loginRequest() {
    return this.store.pipe(select(coreStore.selectLoginRequest), filter(isNotNull));
  }

  constructor(
    private readonly store: Store<AppState>,
    private readonly googleSearchService: GoogleSearchService,
    private readonly storageService: AppStorageService,
  ) {}

  async submitCommand(command: string) {
    this.store.dispatch(coreStore.submitCommand(command));
    // TODO: search if command type is "search"
    const results = await this.googleSearchService.search(command);
    this.store.dispatch(coreStore.resetSearchResults(results));
  }

  submitLoginForm(value: Neo4jAuth) {
    this.storageService.saveNeo4jAuth(value);
    this.store.dispatch(coreStore.submitLoginForm(value));
  }
}
