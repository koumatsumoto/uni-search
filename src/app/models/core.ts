export type SearchResult = {
  readonly domain: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
};

export type BrowseTarget = {
  url: string;
};

export type Neo4jAuth = {
  url: string;
  user: string;
  password: string;
};

export type Neo4jLoginRequirement = {
  time: number;
};

export type ActivityLog = {
  type: 'browse start' | 'browse page';
  data: object;
};
