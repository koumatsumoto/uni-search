import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { Contents, Neo4jAuth } from '../../models/neo4j';
import * as coreStore from '../../store/core.store';
import { AppState } from '../../store/core.store';
import { getGoogleSearchUrl, GoogleSearchService } from '../google/google-search.service';
import { Neo4jConnectionService } from '../neo4j/neo4j-connection.service';
import { Neo4jInitializeService } from '../neo4j/neo4j-initialize.service';
import { Neo4jRepositoryService } from '../neo4j/neo4j-repository.service';
import { AppStorageService } from '../storage/app-storage.service';
import { isNotNull } from '../util/functions';

@Injectable({
  providedIn: 'root',
})
export class AppCommandService {
  constructor(
    private readonly store: Store<AppState>,
    private readonly storage: AppStorageService,
    private readonly repository: Neo4jRepositoryService,
    private readonly googleSearchService: GoogleSearchService,
    private readonly neo4j: Neo4jConnectionService,
    private readonly neo4jInitializeService: Neo4jInitializeService,
  ) {}

  async startExplore(text: string) {
    // show google search result page first
    this.store.dispatch(coreStore.actions.openBrowser({ uri: getGoogleSearchUrl(text) }));

    const searchResults = await this.googleSearchService.search(text);
    const activity = await this.store.pipe(select(coreStore.selectors.selectCurrentActivity), first(isNotNull)).toPromise();
    const result = await this.repository.startSearch({ uri: text, name: text }, activity.id, searchResults);

    this.store.dispatch(coreStore.actions.resetContents(result.contents));
    this.store.dispatch(coreStore.actions.setCurrentSearch(result.search));
  }

  submitLoginForm(value: Neo4jAuth) {
    this.storage.saveNeo4jAuth(value);
    this.neo4j.connect(value);
  }

  async viewContents(target: Contents) {
    this.store.dispatch(coreStore.actions.openBrowser(target));

    const search = await this.store.pipe(select(coreStore.selectors.selectCurrentSearch), first(isNotNull)).toPromise();
    const contents = await this.repository.startView(target, search);
    this.store.dispatch(coreStore.actions.updateOneContents(contents));
  }

  openDatabaseInfoDialog() {
    this.store.dispatch(coreStore.requestDialogOpen({ type: 'database-info', time: Date.now() }));
  }

  async resetDatabase() {
    await this.neo4jInitializeService.resetDatabase();
  }

  viewExplorer() {
    this.store.dispatch(coreStore.switchView('explorer'));
  }

  viewDashboard() {
    this.store.dispatch(coreStore.switchView('dashboard'));
  }

  startActivity() {
    const name = `${new Date().toISOString()}`;

    Promise.all([this.repository.createActivity({ name }), this.repository.findActivities()]).then(([activity, activities]) => {
      this.store.dispatch(coreStore.actions.setCurrentActivity(activity));
      this.store.dispatch(coreStore.actions.setActivityLog(activities));
    });
  }
}
