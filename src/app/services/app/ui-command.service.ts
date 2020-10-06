import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BrowseRequest, GoogleSearchResult, Neo4jAuth } from '../../models/core';
import * as coreStore from '../../store/core.store';
import { AppState } from '../../store/core.store';
import { getGoogleSearchUrl, GoogleSearchService } from '../google/google-search.service';
import { Neo4jLoginService } from '../neo4j/neo4j-login.service';
import { Neo4jService } from '../neo4j/neo4j.service';
import { AppStorageService } from '../storage/app-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UiCommandService {
  constructor(
    private readonly store: Store<AppState>,
    private readonly storage: AppStorageService,
    private readonly googleSearchService: GoogleSearchService,
    private readonly neo4jService: Neo4jService,
    private readonly neo4jLoginService: Neo4jLoginService,
  ) {}

  async search(text: string) {
    this.store.dispatch(coreStore.submitCommand(text));

    this.browse({ url: getGoogleSearchUrl(text) });
    const results = await this.googleSearchService.search(text);
    this.store.dispatch(coreStore.resetSearchResults(results));
  }

  submitLoginForm(value: Neo4jAuth) {
    this.storage.saveNeo4jAuth(value);
    this.neo4jLoginService.tryLogin(value);
  }

  async selectSearchResult(item: GoogleSearchResult) {
    this.browse(item);
    // developing cypher-query
    await this.neo4jService.forSelectedItem(item);
  }

  browse(value: BrowseRequest) {
    this.store.dispatch(coreStore.browserRequest(value));
  }
}
