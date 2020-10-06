import { Injectable } from '@angular/core';
import { GoogleSearchResult } from '../../models/core';
import { Neo4jConnectionService } from './neo4j-connection.service';
import { returnFirstOrNull } from './util';

const defaultUserName = 'main user';

@Injectable({
  providedIn: 'root',
})
export class Neo4jRepositoryService {
  constructor(private readonly neo4j: Neo4jConnectionService) {}

  async getTotalCount() {
    const query = 'MATCH (n) RETURN count(*)';
    const result = await this.neo4j.createSession().run(query);

    return returnFirstOrNull(result.records) as { low: number; high: number };
  }

  async findResource(item: GoogleSearchResult) {
    const query = 'MATCH (r: Resource) WHERE r.uri = $uri RETURN r';
    const result = await this.neo4j.createSession('read').run(query, { uri: item.url });

    return returnFirstOrNull(result.records);
  }

  async createResource(item: GoogleSearchResult) {
    const query = 'CREATE (i: Resource { uri: $uri, title: $title, domain: $domain }) RETURN i';
    const result = await this.neo4j.createSession('write').run(query, {
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
    const result = await this.neo4j.createSession('write').run(query, {
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
}
