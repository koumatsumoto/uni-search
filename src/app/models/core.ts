// after all flags got true, application got ready
export type ApplicationStatus = {
  chromeExtensionWorking: boolean;
  neo4jWorking: boolean;
};

export type GoogleSearchResult = {
  readonly title: string;
  readonly description: string;
  readonly domain: string;
  readonly url: string;
};

export type ApplicationViewType = 'explorer' | 'dashboard';

export type BrowseRequest = {
  readonly url: string;
};

export type Neo4jAuth = {
  readonly url: string;
  readonly user: string;
  readonly password: string;
};

// TODO: rename
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

/**
 * Relationship
 *   - (Activity)-[WebSearch]-(WebContents)
 *   - (Activity)-[View]-(WebContents)
 *   - (Activity)-[Like]-(WebContents)
 *   - (Activity)-[Dislike]-(WebContents)
 *   - (Activity)-[Create]-(Memo)
 */
export type Activity = Readonly<{
  name: string;
  time: number;
  location: string; // TODO: implement by using Web Geolocation API
}>;

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
