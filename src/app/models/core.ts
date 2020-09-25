export type SearchResult = {
  readonly domain: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
};

export type Neo4jAuth = {
  url: string;
  user: string;
  password: string;
};
