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
  readonly title: string;
  readonly description: string;
  readonly domain: string;
  readonly url: string;
};

export type Word = {
  readonly value: string;
};
