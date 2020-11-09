export type GoogleSearchResult = {
  readonly title: string;
  readonly description: string;
  readonly domain: string;
  readonly url: string;
};

export type BrowseRequest = {
  readonly url: string;
};

export type Neo4jAuth = {
  readonly url: string;
  readonly user: string;
  readonly password: string;
};

export type WebContents = {
  readonly uri: string;
  readonly domain: string;
  readonly title: string;
  readonly searchHitCount: number;
  readonly browseCount: number;
  readonly createdAt: number;
  readonly updatedAt: number;
};

export type Word = {
  readonly uri: string;
  readonly name: string;
  readonly searchCount: number;
  readonly createdAt: number;
  readonly updatedAt: number;
};

export type BrowseOption = {
  readonly title: string;
  readonly description: string;
  readonly domain: string;
  readonly url: string;
  readonly searchHitCount?: number;
  readonly browseCount?: number;
  readonly createdAt?: number;
  readonly updatedAt?: number;
};

export type ChromeExtensionStatus = {
  isWorking: boolean;
  expiration: number;
};
