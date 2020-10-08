import { Injectable } from '@angular/core';
import * as neo4j from 'neo4j-driver';
import { ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { GoogleSearchResult } from '../../models/core';
import { LoggerService } from '../logger/logger.service';

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
  private driver: neo4j.Driver | null = null;
  private readonly connectStatus$ = new ReplaySubject<boolean>(1);

  get connectStatus() {
    return this.connectStatus$.asObservable();
  }

  constructor(private readonly logger: LoggerService) {
    // to debug
    // tslint:disable-next-line
    (window as any).neo4j = this;
  }

  async connect(options: { url: string; user: string; password: string }) {
    try {
      if (!this.driver) {
        this.driver = neo4j.driver(options.url, neo4j.auth.basic(options.user, options.password));
      }
      // throw if unauthorized
      await this.driver.verifyConnectivity();
      this.connectStatus$.next(true);
    } catch (e) {
      this.logger.error(e);
      await this.cleanup();
      this.connectStatus$.next(false);
    }

    return this.connectStatus.pipe(first()).toPromise();
  }

  async cleanup() {
    try {
      if (this.driver) {
        await this.driver.close();
      }
    } finally {
      this.driver = null;
    }
  }

  async findUser(name: string) {
    const query = 'MATCH (u: User) WHERE u.name = $name RETURN u';
    const result = await this.getReadSession().run(query, { name });

    return returnFirstOrNull(result.records);
  }

  async findResource(item: GoogleSearchResult) {
    const query = 'MATCH (r: Resource) WHERE r.uri = $uri RETURN r';
    const result = await this.getReadSession().run(query, { uri: item.url });

    return returnFirstOrNull(result.records);
  }

  async createUser(name: string) {
    const query = 'CREATE (u: User { name: $name }) RETURN u';
    const result = await this.getWriteSession().run(query, { name });

    return result;
  }

  async createResource(item: GoogleSearchResult) {
    const query = 'CREATE (i: Resource { uri: $uri, title: $title, domain: $domain }) RETURN i';
    const result = await this.getWriteSession().run(query, {
      uri: item.url,
      title: item.title,
      domain: item.domain,
    });

    return result;
  }

  async createView(item: GoogleSearchResult) {
    const query = `
      MATCH (u: User { name: $name }), (r: Resource { uri: $uri })
      CREATE (u)-[:BROWSE { time: $time }]->(i)`;
    const result = await this.getWriteSession().run(query, {
      name: defaultUserName,
      uri: item.url,
      time: new Date().toISOString(),
    });

    return result;
  }

  async forSelectedItem(item: GoogleSearchResult) {
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

  private getDriverOfFail() {
    if (!this.driver) {
      throw new Error('Neo4jDriverNotPreparedError');
    }

    return this.driver;
  }

  private getReadSession() {
    return this.getDriverOfFail().session({ defaultAccessMode: neo4j.session.READ });
  }

  private getWriteSession() {
    return this.getDriverOfFail().session({ defaultAccessMode: neo4j.session.WRITE });
  }
}
