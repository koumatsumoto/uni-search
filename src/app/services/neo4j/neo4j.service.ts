import { Injectable } from '@angular/core';
import * as neo4j from 'neo4j-driver';
import { SearchResult } from '../google/extract';

const defaultUserName = 'main user';

@Injectable({
  providedIn: 'root',
})
export class Neo4jService {
  private driver: neo4j.Driver;

  constructor() {
    this.driver = neo4j.driver('bolt://localhost:11004', neo4j.auth.basic('neo4j', 'password'));
    this.createUserIfNotExist().catch((e) => console.error(e));
  }

  async findUser(name: string) {
    const query = 'MATCH (u: User) WHERE u.name = $name RETURN u';
    const result = await this.getReadSession().run(query, { name });

    if (result.records.length < 1) {
      return null;
    }

    const values = Array.from(result.records.values());
    const value = values[0];

    return value.get(value.keys[0]);
  }

  async findItem(item: SearchResult) {
    const result = await this.getReadSession().run('MATCH (i: Item) WHERE i.url = $url RETURN i', {
      url: item.href,
    });

    if (result.records.length < 1) {
      return null;
    }

    const values = Array.from(result.records.values());
    const value = values[0];

    return value.get(value.keys[0]);
  }

  async createUser(name: string) {
    const query = 'CREATE (u: User { name: $name }) RETURN u';
    const result = await this.getWriteSession().run(query, {
      name,
    });

    return result;
  }

  async createItem(item: SearchResult) {
    const result = await this.getWriteSession().run('CREATE (i: Item { url: $url, title: $title, domain: $domain }) RETURN i', {
      url: item.href,
      title: item.title,
      domain: item.domain,
    });

    return result;
  }

  async createView(item: SearchResult) {
    const query = `
      MATCH (u: User { name: $name }), (i:Item { url: $url })
      CREATE (u)-[:BROWSE { time: $time }]->(i)`;
    const result = await this.getWriteSession().run(query, {
      name: defaultUserName,
      url: item.href,
      time: new Date().toISOString(),
    });

    return result;
  }

  async forSelectedItem(item: SearchResult) {
    const found = await this.findItem(item);
    if (!found) {
      await this.createItem(item);
    }

    await this.createView(item);
  }

  async createIndexForItems() {
    return this.getWriteSession().run('CREATE INDEX ON :Item(url)');
  }

  async createUserIfNotExist() {
    if (!(await this.findUser(defaultUserName))) {
      await this.createUser(defaultUserName);
    }
  }

  private getReadSession() {
    return this.driver.session({ defaultAccessMode: neo4j.session.READ });
  }

  private getWriteSession() {
    return this.driver.session({ defaultAccessMode: neo4j.session.WRITE });
  }
}
