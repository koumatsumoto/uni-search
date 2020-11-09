export type Neo4jAuth = {
  readonly url: string;
  readonly user: string;
  readonly password: string;
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
  id: number;
  name: string;
  time: number;
  location: string; // TODO: implement by using Web Geolocation API
}>;

export type Contents = {
  readonly id: number;
  readonly uri: string;
  readonly domain: string;
  readonly title: string;
  readonly searchHitCount: number;
  readonly browseCount: number;
  readonly createdAt: number;
  readonly updatedAt: number;
};

export type Word = Readonly<{
  id: number;
  uri: string;
  name: string;
  searchCount: number;
  createdAt: number;
  updatedAt: number;
}>;

export type Search = Readonly<{
  id: number;
}>;
