import { Injectable } from '@angular/core';
import { WebContents, Word } from '../../models/core';
import { Neo4jConnectionService } from './neo4j-connection.service';
import { getSingleNode, getSingleRelationship, returnFirstOrNull } from './util';

// TODO
// tslint:disable-next-line
const toContents = (node: any): WebContents => ({
  uri: node.properties.uri,
  domain: node.properties.domain,
  title: node.properties.title,
  searchHitCount: node.properties.searchHitCount?.toNumber() ?? 0,
  browseCount: node.properties.browseCount?.toNumber() ?? 0,
  createdAt: node.properties.createdAt?.toNumber(),
  updatedAt: node.properties.updatedAt?.toNumber(),
});

// tslint:disable-next-line
const toWord = (node: any): Word => ({
  uri: node.properties.uri,
  name: node.properties.domain,
  searchCount: node.properties.browseCount?.toNumber() ?? 0,
  createdAt: node.properties.createdAt?.toNumber(),
  updatedAt: node.properties.updatedAt?.toNumber(),
});

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

  async updateWebContentsForSearchResult(value: Pick<WebContents, 'uri' | 'title' | 'domain'>): Promise<WebContents> {
    const query = `
      MERGE (n: WebContents {uri: $uri})
        ON CREATE SET n = { title: $title, domain: $domain, createdAt: timestamp(), updatedAt: timestamp(), searchHitCount: 1, browseCount: 0, uri: $uri }
        ON MATCH SET n += { title: $title, domain: $domain, updatedAt: timestamp(), searchHitCount: n.searchHitCount + 1 }
      RETURN n;
    `;

    const result = await this.neo4j.createSession().run(query, value);
    const record = result.records[0];
    const node = record.get(0);

    return toContents(node);
  }

  async updateWebContentsForBrowse(value: Pick<WebContents, 'uri' | 'title' | 'domain'>): Promise<WebContents> {
    const query = `
      MERGE (n: WebContents {uri: $uri})
        ON CREATE SET n = { title: $title, domain: $domain, createdAt: timestamp(), updatedAt: timestamp(), searchHitCount: 1, browseCount: 0, uri: $uri }
        ON MATCH SET n += { updatedAt: timestamp(), browseCount: n.browseCount + 1 }
      RETURN n;
    `;

    const result = await this.neo4j.createSession().run(query, value);
    const record = result.records[0];
    const node = record.get(0);

    return toContents(node);
  }

  async updateWord(value: Pick<Word, 'uri' | 'name'>): Promise<Word> {
    const query = `
      MERGE (n: Word {uri: $uri})
        ON CREATE SET n = { uri: $uri, name: $name, searchCount: 1, createdAt: timestamp(), updatedAt: timestamp() }
        ON MATCH SET n += { name: $name, searchCount: n.searchCount + 1, updatedAt: timestamp() }
      RETURN n;
    `;

    const result = await this.neo4j.createSession().run(query, value);
    const record = result.records[0];
    const node = record.get(0);

    return toWord(node);
  }

  async addRelationship(value: { wordUri: string; contentsUri: string }) {
    const query = `
      MATCH (a: Word), (b: WebContents)
      WHERE a.uri = $wordUri AND b.uri = $contentsUri
      CREATE (b)-[r:SearchResult]->(a)
      RETURN r;
    `;

    const result = await this.neo4j.createSession().run(query, value);
    const record = result.records[0];
    const node = record.get(0);

    return node;
  }

  async getAll() {
    const [nodes, relationships] = await Promise.all([this.getAllNodes(), this.getAllRelationships()]);

    return { nodes, relationships };
  }

  private async getAllNodes() {
    const query = `MATCH (n) RETURN n;`;
    const result = await this.neo4j.createSession().run(query);

    return result.records.map(getSingleNode);
  }

  private async getAllRelationships() {
    const query = `MATCH ()-[r]-() RETURN r`;
    const result = await this.neo4j.createSession().run(query);

    return result.records.map(getSingleRelationship);
  }
}
