import { createAction, createReducer, createSelector, on, union } from '@ngrx/store';
import { Neo4jAuth, SearchResult } from '../models/core';

export const storeName = 'core';
export const initialState = {
  command: '',
  searchResults: null as SearchResult[] | null,
  loginFormValue: null as Neo4jAuth | null,
  loginRequest: null as number | null,
};
export type State = Readonly<typeof initialState>;
export type AppState = { [storeName]: State };

export const submitCommand = createAction('[Command] submit', (command: string) => ({ data: command }));
export const resetSearchResults = createAction('[Search] update results', (results: SearchResult[]) => ({ data: results }));
export const submitLoginForm = createAction('[Neo4j] submit neo4j login form', (value: Neo4jAuth) => ({ data: value }));
export const requestNeo4jLogin = createAction('[Neo4j] request neo4j login', (requestedAt: number) => ({ data: requestedAt }));

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
  on(submitLoginForm, (state, action) => ({
    ...state,
    loginFormValue: action.data,
  })),
  on(requestNeo4jLogin, (state, action) => ({
    ...state,
    loginRequest: action.data,
  })),
);

export const reducer = (state: State, action: ActionsUnion) => {
  return innerReducer(state, action);
};

export const selectFeatureStore = (state: AppState) => state.core;

export const selectCommand = createSelector(selectFeatureStore, (state: State) => state.command);
export const selectSearchResults = createSelector(selectFeatureStore, (state: State) => state.searchResults);
export const selectLoginFormValue = createSelector(selectFeatureStore, (state: State) => state.loginFormValue);
export const selectLoginRequest = createSelector(selectFeatureStore, (state: State) => state.loginRequest);
