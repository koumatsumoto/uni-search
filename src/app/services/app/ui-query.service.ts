import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import * as coreStore from '../../store/core.store';
import { AppState } from '../../store/core.store';
import { AppStorageService } from '../storage/app-storage.service';

const isNotNull = <T>(value: T | null): value is T => value !== null;

@Injectable({
  providedIn: 'root',
})
export class UiQueryService {
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

  constructor(private readonly store: Store<AppState>, private readonly storage: AppStorageService) {}
}
