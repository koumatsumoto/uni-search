import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BrowseRequest, GoogleSearchResult, Neo4jAuth } from '../../models/core';
import * as coreStore from '../../store/core.store';
import { AppState } from '../../store/core.store';
import { getGoogleSearchUrl, GoogleSearchService } from '../google/google-search.service';
import { Neo4jAuthService } from '../neo4j/neo4j-auth.service';
import { Neo4jInitializeService } from '../neo4j/neo4j-initialize.service';
import { Neo4jRepositoryService } from '../neo4j/neo4j-repository.service';
import { AppStorageService } from '../storage/app-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UiCommandService {
  constructor(
    private readonly store: Store<AppState>,
    private readonly storage: AppStorageService,
    private readonly googleSearchService: GoogleSearchService,
    private readonly neo4jService: Neo4jRepositoryService,
    private readonly neo4jLoginService: Neo4jAuthService,
    private readonly neo4jInitializeService: Neo4jInitializeService,
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

  openDatabaseInfoDialog() {
    this.store.dispatch(coreStore.requestDialogOpen({ type: 'database-info', time: Date.now() }));
  }

  async resetDatabase() {
    await this.neo4jInitializeService.resetDatabase();
  }
}
