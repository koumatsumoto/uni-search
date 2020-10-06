import { createAction, createReducer, createSelector, on, union } from '@ngrx/store';
import { BrowseRequest, GoogleSearchResult } from '../models/core';

export const storeName = 'core';
export const initialState = {
  command: '',
  searchResults: null as GoogleSearchResult[] | null,
  browseRequest: null as BrowseRequest | null,
};
export type State = Readonly<typeof initialState>;
export type AppState = { [storeName]: State };

export const submitCommand = createAction('[Command] submit', (command: string) => ({ data: command }));
export const resetSearchResults = createAction('[Search] update results', (results: GoogleSearchResult[]) => ({ data: results }));
export const browserRequest = createAction('[Search] browse request', (value: BrowseRequest) => ({ data: value }));
const actions = union({ submitCommand });
export type ActionsUnion = typeof actions;

const innerReducer = createReducer(
  initialState,
  on(submitCommand, (state, action) => ({
    ...state,
    command: action.data,
  })),
  on(resetSearchResults, (state, action) => ({
    ...state,
    searchResults: action.data,
  })),
  on(browserRequest, (state, action) => ({
    ...state,
    browseRequest: action.data,
  })),
);
export const reducer = (state: State, action: ActionsUnion) => innerReducer(state, action);

export const selectFeatureStore = (state: AppState) => state.core;
export const selectCommand = createSelector(selectFeatureStore, (state: State) => state.command);
export const selectSearchResults = createSelector(selectFeatureStore, (state: State) => state.searchResults);
export const selectBrowseRequest = createSelector(selectFeatureStore, (state: State) => state.browseRequest);
