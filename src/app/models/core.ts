// after all flags got true, application got ready
export type ApplicationStatus = {
  appComponentInitialized: boolean;
  chromeExtensionWorking: boolean | null;
  neo4jWorking: boolean | null;
};

export type SearchResult = {
  readonly title: string;
  readonly description: string;
  readonly domain: string;
  readonly uri: string;
};

export type ApplicationViewType = 'explorer' | 'dashboard';

export type BrowseRequest = {
  readonly uri: string;
};

export type ChromeExtensionStatus = {
  isWorking: boolean;
  expiration: number;
};
