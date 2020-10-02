import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { BrowseTarget, Neo4jAuth, SearchResult } from '../../models/core';
import * as coreStore from '../../store/core.store';
import { AppState } from '../../store/core.store';
import { GoogleSearchService } from '../google/google-search.service';
import { Neo4jService } from '../neo4j/neo4j.service';
import { AppStorageService } from '../storage/app-storage.service';

const isNotNull = <T>(value: T | null): value is T => value !== null;

@Injectable({
  providedIn: 'root',
})
export class UiDataService {
  get submittedCommand() {
    return this.store.pipe(select(coreStore.selectCommand));
  }

  get searchResults() {
    return this.store.pipe(select(coreStore.selectSearchResults), filter(isNotNull));
  }

  get loginRequest() {
    return this.store.pipe(select(coreStore.selectLoginRequest), filter(isNotNull));
  }

  get browseTarget() {
    return this.store.pipe(select(coreStore.selectBrowseTarget), filter(isNotNull));
  }

  get activityLogs() {
    return this.store.pipe(select(coreStore.selectActivityLogs));
  }

  constructor(
    private readonly store: Store<AppState>,
    private readonly googleSearchService: GoogleSearchService,
    private readonly storageService: AppStorageService,
    private readonly neo4jService: Neo4jService,
  ) {}

  async submitCommand(command: string) {
    this.store.dispatch(coreStore.submitCommand(command));
    // TODO: search if command type is "search"
    this.store.dispatch(coreStore.browseSearchResult({ url: `https://www.google.com/search?q=${command}` }));
    this.store.dispatch(coreStore.addActivityLog({ type: 'browse start', data: {} }));
    const results = await this.googleSearchService.search(command);
    this.store.dispatch(coreStore.resetSearchResults(results));
  }

  submitLoginForm(value: Neo4jAuth) {
    this.storageService.saveNeo4jAuth(value);
    this.store.dispatch(coreStore.submitLoginForm(value));
  }

  async selectSearchResult(item: SearchResult) {
    this.store.dispatch(coreStore.browseSearchResult({ url: item.href }));
    this.store.dispatch(coreStore.addActivityLog({ type: 'browse page', data: { url: item.href } }));
    // developing cypher-query
    await this.neo4jService.forSelectedItem(item);
  }

  browse(value: BrowseTarget) {
    this.store.dispatch(coreStore.browseSearchResult(value));
  }
}
