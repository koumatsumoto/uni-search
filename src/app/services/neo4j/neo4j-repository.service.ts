import { Injectable } from '@angular/core';
import { WebContents } from '../../models/core';
import { Neo4jConnectionService } from './neo4j-connection.service';
import { returnFirstOrNull } from './util';

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
        ON CREATE SET n.title = $title, n.domain = $domain, n.createdAt = timestamp(), n.updatedAt = timestamp(), n.searchHitCount = 1
        ON MATCH SET n.title = $title, n.domain = $domain, n.updatedAt = timestamp(), n.searchHitCount = n.searchHitCount + 1
      RETURN n;
    `;

    const result = await this.neo4j.createSession().run(query, value);
    const record = result.records[0];
    const node = record.get(0);

    return {
      uri: node.properties.uri,
      domain: node.properties.domain,
      title: node.properties.title,
      searchHitCount: node.properties.searchHitCount.toNumber(),
      createdAt: node.properties.createdAt.toNumber(),
      updatedAt: node.properties.updatedAt.toNumber(),
    };
  }
}
