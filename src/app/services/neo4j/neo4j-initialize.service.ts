import { Injectable } from '@angular/core';
import { Neo4jConnectionService } from './neo4j-connection.service';

const ignoreError = async (fn: () => Promise<unknown>) => {
  try {
    await fn();
  } catch {}
};

@Injectable({
  providedIn: 'root',
})
export class Neo4jInitializeService {
  constructor(private readonly neo4j: Neo4jConnectionService) {}

  async resetDatabase() {
    await this.deleteAll();
    await this.initializeIndexes();
  }

  private async initializeIndexes() {
    await ignoreError(() => this.neo4j.createSession().run('DROP INDEX ON:Contents(uri)'));
    await ignoreError(() => this.neo4j.createSession().run('CREATE CONSTRAINT ON (n:Contents) ASSERT n.uri IS UNIQUE;'));
  }

  private async deleteAll() {
    const query = 'MATCH (n) DETACH DELETE n';
    const result = await this.neo4j.createSession().run(query);

    return result;
  }
}
