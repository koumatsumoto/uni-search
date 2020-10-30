import { createAction, createReducer, createSelector, on, union } from '@ngrx/store';
import {
  BrowseRequest,
  ChromeExtensionStatus,
  GoogleSearchResult,
  ApplicationViewType,
  WebContents,
  ApplicationStatus,
  Activity,
} from '../models/core';

export const storeName = 'core';
export const initialState = {
  appStatus: {
    appComponentInitialized: false,
    chromeExtensionWorking: null,
    neo4jWorking: null,
  } as ApplicationStatus,
  viewType: 'explorer' as ApplicationViewType,
  searchWord: '',
  searchResults: null as GoogleSearchResult[] | null,
  browseRequest: null as BrowseRequest | null,
  dialogOpenRequest: null as { type: 'database-info' | 'login' | 'extension-info'; time: number } | null,
  webContents: {
    dictionary: new Map<WebContents['uri'], WebContents>(),
    lastUpdate: Date.now(),
  } as const,
  chromeExtensionStatus: null as null | ChromeExtensionStatus,
  activity: null as Activity | null,
  activityLog: null as null | Activity[],
};
export type State = Readonly<typeof initialState>;
export type AppState = { [storeName]: State };

export const updateAppStatus = createAction('[App] update application status', (data: Partial<ApplicationStatus>) => ({ data }));
export const switchView = createAction('[View] switch application view type', (type: ApplicationViewType) => ({ data: type }));
export const searchWord = createAction('[Command] search word', (word: string) => ({ data: word }));
export const resetSearchResults = createAction('[Search] update results', (results: GoogleSearchResult[]) => ({ data: results }));
export const browserRequest = createAction('[Search] browse request', (value: BrowseRequest) => ({ data: value }));
export const requestDialogOpen = createAction('[UI] request dialog open', (request: State['dialogOpenRequest']) => ({ data: request }));
export const updateExtensionStatus = createAction('[Extension] update status', (status: ChromeExtensionStatus) => ({ data: status }));
const createActivity = createAction('[Data] create new activity', (name: string) => ({ data: name }));
const setActivityLog = createAction('[Data] set activity log', (activities: Activity[]) => ({ data: activities }));
export const updateWebContents = createAction('[Data] update multiple webcontents', (data: WebContents[], updateTime = Date.now()) => ({
  data,
  updateTime,
}));

export const actions = {
  updateAppStatus,
  switchView,
  searchWord,
  resetSearchResults,
  browserRequest,
  requestDialogOpen,
  updateWebContents,
  updateExtensionStatus,
  createActivity,
  setActivityLog,
};
const actionUnion = union(actions);
export type ActionsUnion = typeof actionUnion;

const defaultUpdateFn = <V>(value: V, newValue: V): V => newValue;
const objectUpdateFn = <V extends State[keyof State] & object>(current: V, newValue: V): V => ({ ...current, ...newValue });
const merge = <K extends keyof State, V = State[K]>(key: K, updateFn: (current: V, newValue: V) => V = defaultUpdateFn) => (
  state: State,
  action: ActionsUnion,
): State => ({
  ...state,
  // TODO: refine type check
  // tslint:disable-next-line
  [key]: updateFn(state[key] as any, action.data as any),
});

const innerReducer = createReducer(
  initialState,
  on(updateAppStatus, merge('appStatus', objectUpdateFn)),
  on(switchView, merge('viewType')),
  on(searchWord, merge('searchWord')),
  on(resetSearchResults, merge('searchResults')),
  on(browserRequest, merge('browseRequest')),
  on(requestDialogOpen, merge('dialogOpenRequest')),
  on(updateExtensionStatus, merge('chromeExtensionStatus')),
  on(createActivity, merge('activity')),
  on(setActivityLog, merge('activityLog')),
  on(updateWebContents, (state, action) => {
    action.data.forEach((contents) => state.webContents.dictionary.set(contents.uri, contents));

    return { ...state, webContents: { dictionary: state.webContents.dictionary, lastUpdate: action.updateTime } };
  }),
);
export const reducer = (state: State, action: ActionsUnion) => innerReducer(state, action);

export const selectFeatureStore = (state: AppState) => state.core;
export const selectViewType = createSelector(selectFeatureStore, (state: State) => state.viewType);
export const selectCommand = createSelector(selectFeatureStore, (state: State) => state.searchWord);
export const selectSearchResults = createSelector(selectFeatureStore, (state: State) => state.searchResults);
export const selectBrowseRequest = createSelector(selectFeatureStore, (state: State) => state.browseRequest);
export const selectDialogOpenRequest = createSelector(selectFeatureStore, (state: State) => state.dialogOpenRequest);
export const selectWebContents = createSelector(selectFeatureStore, (state: State) => state.webContents);
const selectAppState = createSelector(selectFeatureStore, (state: State) => state.appStatus);
const selectAppStateChromeExtension = createSelector(selectFeatureStore, (state: State) => state.appStatus.chromeExtensionWorking);
const selectActivity = createSelector(selectFeatureStore, (state: State) => state.activity);
const selectActivityLog = createSelector(selectFeatureStore, (state: State) => state.activityLog);

// public api
export const selectors = {
  selectViewType,
  selectCommand,
  selectSearchResults,
  selectBrowseRequest,
  selectDialogOpenRequest,
  selectWebContents,
  selectAppState,
  selectActivity,
  selectActivityLog,
  selectAppStateChromeExtension,
};
