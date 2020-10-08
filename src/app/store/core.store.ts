import { createAction, createReducer, createSelector, on, union } from '@ngrx/store';
import { BrowseRequest, GoogleSearchResult, WebContents } from '../models/core';

export const storeName = 'core';
export const initialState = {
  command: '',
  searchResults: null as GoogleSearchResult[] | null,
  browseRequest: null as BrowseRequest | null,
  dialogOpenRequest: null as { type: string; time: number } | null,
  webContents: {
    dictionary: new Map<WebContents['uri'], WebContents>(),
    lastUpdate: Date.now(),
  } as const,
};
export type State = Readonly<typeof initialState>;
export type AppState = { [storeName]: State };

export const submitCommand = createAction('[Command] submit', (command: string) => ({ data: command }));
export const resetSearchResults = createAction('[Search] update results', (results: GoogleSearchResult[]) => ({ data: results }));
export const browserRequest = createAction('[Search] browse request', (value: BrowseRequest) => ({ data: value }));
export const requestDialogOpen = createAction('[UI] request dialog open', (request: { type: string; time: number }) => ({ data: request }));
export const updateWebContents = createAction('[Data] update multiple webcontents', (data: WebContents[], updateTime = Date.now()) => ({
  data,
  updateTime,
}));
const actions = union({ submitCommand });
export type ActionsUnion = typeof actions;

const innerReducer = createReducer(
  initialState,
  on(submitCommand, (state, action) => ({ ...state, command: action.data })),
  on(resetSearchResults, (state, action) => ({ ...state, searchResults: action.data })),
  on(browserRequest, (state, action) => ({ ...state, browseRequest: action.data })),
  on(requestDialogOpen, (state, action) => ({ ...state, dialogOpenRequest: action.data })),
  on(updateWebContents, (state, action) => {
    action.data.forEach((contents) => state.webContents.dictionary.set(contents.uri, contents));

    return { ...state, webContents: { dictionary: state.webContents.dictionary, lastUpdate: action.updateTime } };
  }),
);
export const reducer = (state: State, action: ActionsUnion) => innerReducer(state, action);

export const selectFeatureStore = (state: AppState) => state.core;
export const selectCommand = createSelector(selectFeatureStore, (state: State) => state.command);
export const selectSearchResults = createSelector(selectFeatureStore, (state: State) => state.searchResults);
export const selectBrowseRequest = createSelector(selectFeatureStore, (state: State) => state.browseRequest);
export const selectDialogOpenRequest = createSelector(selectFeatureStore, (state: State) => state.dialogOpenRequest);
export const selectWebContents = createSelector(selectFeatureStore, (state: State) => state.webContents);
