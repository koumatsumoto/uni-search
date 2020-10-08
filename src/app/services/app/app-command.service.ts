import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BrowseOption, GoogleSearchResult, Neo4jAuth } from '../../models/core';
import * as coreStore from '../../store/core.store';
import { AppState } from '../../store/core.store';
import { getGoogleSearchUrl, GoogleSearchService } from '../google/google-search.service';
import { Neo4jAuthService } from '../neo4j/neo4j-auth.service';
import { Neo4jInitializeService } from '../neo4j/neo4j-initialize.service';
import { Neo4jRepositoryService } from '../neo4j/neo4j-repository.service';
import { AppStorageService } from '../storage/app-storage.service';

const toWebContents = (searchResult: GoogleSearchResult) => ({
  ...searchResult,
  uri: searchResult.url,
});

@Injectable({
  providedIn: 'root',
})
export class AppCommandService {
  constructor(
    private readonly store: Store<AppState>,
    private readonly storage: AppStorageService,
    private readonly repository: Neo4jRepositoryService,
    private readonly googleSearchService: GoogleSearchService,
    private readonly neo4jLoginService: Neo4jAuthService,
    private readonly neo4jInitializeService: Neo4jInitializeService,
  ) {}

  async search(text: string) {
    this.store.dispatch(coreStore.submitCommand(text));
    this.store.dispatch(coreStore.browserRequest({ url: getGoogleSearchUrl(text) }));

    const results = await this.googleSearchService.search(text);
    this.store.dispatch(coreStore.resetSearchResults(results));

    const contents = await Promise.all(results.map((item) => this.repository.updateWebContentsForSearchResult(toWebContents(item))));
    this.store.dispatch(coreStore.updateWebContents(contents));
  }

  submitLoginForm(value: Neo4jAuth) {
    this.storage.saveNeo4jAuth(value);
    this.neo4jLoginService.tryLogin(value);
  }

  async selectSearchResult(item: BrowseOption) {
    await this.browse(item);
  }

  async browse(value: BrowseOption) {
    this.store.dispatch(coreStore.browserRequest(value));
    const contents = await this.repository.updateWebContentsForBrowse({ ...value, uri: value.url });
    this.store.dispatch(coreStore.updateWebContents([contents]));
  }

  openDatabaseInfoDialog() {
    this.store.dispatch(coreStore.requestDialogOpen({ type: 'database-info', time: Date.now() }));
  }

  async resetDatabase() {
    await this.neo4jInitializeService.resetDatabase();
  }
}
