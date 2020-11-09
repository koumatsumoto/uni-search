import { createAction, createReducer, createSelector, on, union } from '@ngrx/store';
import { ApplicationStatus, ApplicationViewType, BrowseRequest, ChromeExtensionStatus, SearchResult } from '../models/core';
import { Activity, Contents, Search } from '../models/neo4j';

export const storeName = 'core';
export const initialState = {
  appStatus: {
    appComponentInitialized: false,
    chromeExtensionWorking: null,
    neo4jWorking: null,
  } as ApplicationStatus,
  viewType: 'explorer' as ApplicationViewType,
  searchResults: null as SearchResult[] | null,
  browseRequest: null as SearchResult | null,
  dialogOpenRequest: null as { type: 'database-info' | 'login' | 'extension-info'; time: number } | null,
  contents: [] as Contents[],
  currentSearch: null as Search | null,
  chromeExtensionStatus: null as null | ChromeExtensionStatus,
  currentActivity: null as Activity | null,
  activityLog: null as null | Activity[],
};
export type State = Readonly<typeof initialState>;
export type AppState = { [storeName]: State };

export const updateAppStatus = createAction('[App] update application status', (data: Partial<ApplicationStatus>) => ({ data }));
export const switchView = createAction('[View] switch application view type', (type: ApplicationViewType) => ({ data: type }));
export const openBrowser = createAction('[Search] browse request', (value: BrowseRequest) => ({ data: value }));
export const requestDialogOpen = createAction('[UI] request dialog open', (request: State['dialogOpenRequest']) => ({ data: request }));
export const updateExtensionStatus = createAction('[Extension] update status', (status: ChromeExtensionStatus) => ({ data: status }));
const setCurrentActivity = createAction('[Data] set newly current activity', (activity: Activity) => ({ data: activity }));
const setActivityLog = createAction('[Data] set activity log', (activities: Activity[]) => ({ data: activities }));
const resetContents = createAction('[Data] reset contents', (data: Contents[]) => ({ data }));
const updateOneContents = createAction('[Data] update one contents', (data: Contents) => ({ data }));
const setCurrentSearch = createAction('[Data] set newly current search', (data: Search) => ({ data }));

export const actions = {
  updateAppStatus,
  switchView,
  openBrowser,
  requestDialogOpen,
  updateExtensionStatus,
  setCurrentActivity,
  setActivityLog,
  resetContents,
  updateOneContents,
  setCurrentSearch,
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
  on(openBrowser, merge('browseRequest')),
  on(requestDialogOpen, merge('dialogOpenRequest')),
  on(updateExtensionStatus, merge('chromeExtensionStatus')),
  on(setCurrentActivity, merge('currentActivity')),
  on(setCurrentSearch, merge('currentSearch')),
  on(setActivityLog, merge('activityLog')),
  on(resetContents, merge('contents')),
  on(updateOneContents, (state, action) => ({
    ...state,
    contents: state.contents.map((c) => (c.id === action.data.id ? action.data : c)),
  })),
);
export const reducer = (state: State, action: ActionsUnion) => innerReducer(state, action);

export const selectFeatureStore = (state: AppState) => state.core;
export const selectViewType = createSelector(selectFeatureStore, (state: State) => state.viewType);
export const selectBrowseRequest = createSelector(selectFeatureStore, (state: State) => state.browseRequest);
export const selectDialogOpenRequest = createSelector(selectFeatureStore, (state: State) => state.dialogOpenRequest);
const selectFoundContents = createSelector(selectFeatureStore, (state: State) => state.contents);
const selectAppState = createSelector(selectFeatureStore, (state: State) => state.appStatus);
const selectAppStateChromeExtension = createSelector(selectFeatureStore, (state: State) => state.appStatus.chromeExtensionWorking);
const selectCurrentActivity = createSelector(selectFeatureStore, (state: State) => state.currentActivity);
const selectCurrentSearch = createSelector(selectFeatureStore, (state: State) => state.currentSearch);
const selectActivityLog = createSelector(selectFeatureStore, (state: State) => state.activityLog);

// public api
export const selectors = {
  selectViewType,
  selectBrowseRequest,
  selectDialogOpenRequest,
  selectFoundContents,
  selectAppState,
  selectCurrentActivity,
  selectActivityLog,
  selectAppStateChromeExtension,
  selectCurrentSearch,
};
