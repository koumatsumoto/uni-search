import { Injectable } from '@angular/core';
import * as neo4j from 'neo4j-driver';
import { SearchResult } from '../google/extract';

const defaultUserName = 'main user';
const returnFirstOrNull = (records: neo4j.Record[]) => {
  if (records.length < 1) {
    return null;
  }

  const values = Array.from(records.values());
  const value = values[0];

  return value.get(value.keys[0]);
};

@Injectable({
  providedIn: 'root',
})
export class Neo4jService {
  private driver: neo4j.Driver;

  constructor() {
    this.driver = neo4j.driver('bolt://localhost:11004', neo4j.auth.basic('neo4j', 'password'));
    this.createUserIfNotExist().catch((e) => console.error(e));
    // to debug
    // tslint:disable-next-line
    (window as any).neo4j = this;
  }

  async findUser(name: string) {
    const query = 'MATCH (u: User) WHERE u.name = $name RETURN u';
    const result = await this.getReadSession().run(query, { name });

    return returnFirstOrNull(result.records);
  }

  async findResource(item: SearchResult) {
    const query = 'MATCH (r: Resource) WHERE r.uri = $uri RETURN r';
    const result = await this.getReadSession().run(query, { uri: item.href });

    return returnFirstOrNull(result.records);
  }

  async createUser(name: string) {
    const query = 'CREATE (u: User { name: $name }) RETURN u';
    const result = await this.getWriteSession().run(query, { name });

    return result;
  }

  async createResource(item: SearchResult) {
    const query = 'CREATE (i: Resource { uri: $uri, title: $title, domain: $domain }) RETURN i';
    const result = await this.getWriteSession().run(query, {
      uri: item.href,
      title: item.title,
      domain: item.domain,
    });

    return result;
  }

  async createView(item: SearchResult) {
    const query = `
      MATCH (u: User { name: $name }), (r: Resource { uri: $uri })
      CREATE (u)-[:BROWSE { time: $time }]->(i)`;
    const result = await this.getWriteSession().run(query, {
      name: defaultUserName,
      uri: item.href,
      time: new Date().toISOString(),
    });

    return result;
  }

  async forSelectedItem(item: SearchResult) {
    const found = await this.findResource(item);
    if (!found) {
      await this.createResource(item);
    }

    await this.createView(item);
  }

  async createIndexes() {
    await this.getWriteSession().run('CREATE INDEX ON :USER(name)');
    await this.getWriteSession().run('CREATE INDEX ON :Resource(uri)');
  }

  async createUserIfNotExist() {
    if (!(await this.findUser(defaultUserName))) {
      await this.createUser(defaultUserName);
    }
  }

  async deleteAll() {
    const query = 'MATCH (n) DETACH DELETE n';
    const result = await this.getWriteSession().run(query);

    return result;
  }

  private getReadSession() {
    return this.driver.session({ defaultAccessMode: neo4j.session.READ });
  }

  private getWriteSession() {
    return this.driver.session({ defaultAccessMode: neo4j.session.WRITE });
  }
}
