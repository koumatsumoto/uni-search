import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BrowseOption, GoogleSearchResult, WebContents } from '../../models/core';
import * as coreStore from '../../store/core.store';
import { AppState } from '../../store/core.store';
import { Neo4jRepositoryService } from '../neo4j/neo4j-repository.service';
import { AppStorageService } from '../storage/app-storage.service';
import { isNotNull } from '../util/functions';

const makeBrowseOption = (searchResult: GoogleSearchResult, contentsMap: Map<string, WebContents>): BrowseOption => {
  const contents = contentsMap.get(searchResult.url);

  return !contents ? searchResult : { ...searchResult, ...contents };
};

@Injectable({
  providedIn: 'root',
})
export class AppQueryService {
  get viewType() {
    return this.store.pipe(select(coreStore.selectViewType), filter(isNotNull));
  }

  get searchResults() {
    return this.store.pipe(select(coreStore.selectSearchResults), filter(isNotNull));
  }

  get browseRequest() {
    return this.store.pipe(select(coreStore.selectBrowseRequest), filter(isNotNull));
  }

  get cachedLoginInformation() {
    const cache = this.storage.loadNeo4jAuth();

    return !!cache
      ? cache
      : {
          url: '',
          user: '',
          password: '',
        };
  }

  get dialogOpenRequest() {
    return this.store.pipe(select(coreStore.selectDialogOpenRequest), filter(isNotNull));
  }

  constructor(
    private readonly store: Store<AppState>,
    private readonly storage: AppStorageService,
    private readonly repository: Neo4jRepositoryService,
  ) {}

  getTotalRecordCount() {
    return from(this.repository.getTotalCount());
  }

  get searchResultList() {
    return combineLatest(this.searchResults, this.store.pipe(select(coreStore.selectWebContents))).pipe(
      map(([searchResults, contents]) => searchResults.map((item) => makeBrowseOption(item, contents.dictionary))),
    );
  }
}
