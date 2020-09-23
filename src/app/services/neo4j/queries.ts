import * as neo4j from 'neo4j-driver';

const findUser = 'MATCH (u: User) WHERE u.name = $name RETURN u';

export type User = {
  name: string;
};

// e.g. Webpage
export type Resource = {
  uri: string;
  fqdn: string;
  name: string;
  description: string;
  type: 'user' | 'webpage';
};

export type Search = {
  time: string; // ISO date string
  source: Resource['uri']; // e.g. "https://www.google.com/search?q=..."
};

export type Browse = {
  time: string; // ISO date string
};

export const findQuery = {
  'find-user': 'MATCH (u: User) WHERE u.name = $name RETURN u',
  'create-user': 'CREATE (u: User { name: $name }) RETURN u',
  'find-resource': 'MATCH (r: Resource) WHERE r.uri = $uri RETURN r',
  'create-resource': 'CREATE (r: Resource { uri: $url, fqdn: $fqdn, name: $name, description: $description }) RETURN r',
};

export const createQuery = {
  'create-user': 'CREATE (u: User { name: $name }) RETURN u',
  'create-resource': 'CREATE (r: Resource { uri: $url, fqdn: $fqdn, name: $name, description: $description }) RETURN r',
};

export function getQuery(type: 'find-user' | 'create-user', params: { name: string }): [string, object];
export function getQuery(type: 'find-resource', params: { uri: string }): [string, object];
export function getQuery(
  type: 'create-resource',
  params: { uri: string; fqdn: string; name: string; description: string },
): [string, object];
export function getQuery(type: keyof typeof findQuery, params: object) {
  return [findQuery[type], params];
}

export const findOne = async (type: 'user' | 'resource', driver: neo4j.Driver) => {
  const nodeType = type === 'user' ? 'find-user' : 'find-resource';

  const result = await driver.session({ defaultAccessMode: neo4j.session.READ }).run(...getQuery('find-user', { name }));
};
