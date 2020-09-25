import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as coreStore from '../../store/core.store';
import { AppState } from '../../store/core.store';
import { GoogleSearchService } from '../google/google-search.service';

@Injectable({
  providedIn: 'root',
})
export class UiDataService {
  get command() {
    return this.store.pipe(select(coreStore.selectCommand));
  }

  get searchResults() {
    return this.store.pipe(select(coreStore.selectSearchResults));
  }

  constructor(private readonly store: Store<AppState>, private readonly googleSearchService: GoogleSearchService) {}

  async submitCommand(command: string) {
    this.store.dispatch(coreStore.submitCommand(command));
    // TODO: search if command type is "search"
    const results = await this.googleSearchService.search(command);
    this.store.dispatch(coreStore.resetSearchResults(results));
  }
}
