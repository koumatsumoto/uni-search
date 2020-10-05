import { createAction, createReducer, createSelector, on, union } from '@ngrx/store';
import { ActivityLog, BrowseTarget, Neo4jAuth, Neo4jLoginRequirement, SearchResult } from '../models/core';

export const storeName = 'core';
export const initialState = {
  command: '',
  searchResults: null as SearchResult[] | null,
  browseTarget: null as BrowseTarget | null,
  loginAuth: null as Neo4jAuth | null,
  loginRequirement: null as Neo4jLoginRequirement | null,
  activityLogs: [] as ActivityLog[],
};
export type State = Readonly<typeof initialState>;
export type AppState = { [storeName]: State };

export const submitCommand = createAction('[Command] submit', (command: string) => ({ data: command }));
export const resetSearchResults = createAction('[Search] update results', (results: SearchResult[]) => ({ data: results }));
export const browseSearchResult = createAction('[Search] browse a search result', (value: BrowseTarget) => ({ data: value }));
export const requestLogin = createAction('[Neo4j] request login to neo4j', (value: Neo4jAuth) => ({ data: value }));
export const requireLogin = createAction('[Neo4j] require login to neo4j', (requiredAt: number) => ({ data: { time: requiredAt } }));
export const addActivityLog = createAction('[Activity] add', (act: ActivityLog) => ({ data: act }));
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
  on(browseSearchResult, (state, action) => ({
    ...state,
    browseTarget: action.data,
  })),
  on(requestLogin, (state, action) => ({
    ...state,
    loginAuth: action.data,
  })),
  on(requireLogin, (state, action) => ({
    ...state,
    loginRequirement: action.data,
  })),
  on(addActivityLog, (state, action) => ({
    ...state,
    activityLogs: [...state.activityLogs, action.data],
  })),
);
export const reducer = (state: State, action: ActionsUnion) => innerReducer(state, action);

export const selectFeatureStore = (state: AppState) => state.core;
export const selectCommand = createSelector(selectFeatureStore, (state: State) => state.command);
export const selectSearchResults = createSelector(selectFeatureStore, (state: State) => state.searchResults);
export const selectBrowseTarget = createSelector(selectFeatureStore, (state: State) => state.browseTarget);
export const selectLoginRequest = createSelector(selectFeatureStore, (state: State) => state.loginAuth);
export const selectLoginRequirement = createSelector(selectFeatureStore, (state: State) => state.loginRequirement);
export const selectActivityLogs = createSelector(selectFeatureStore, (state: State) => state.activityLogs);
