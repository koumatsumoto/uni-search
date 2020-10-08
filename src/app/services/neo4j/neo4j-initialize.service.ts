import { Injectable } from '@angular/core';
import { Neo4jConnectionService } from './neo4j-connection.service';

const defaultUserName = 'main user';

@Injectable({
  providedIn: 'root',
})
export class Neo4jInitializeService {
  constructor(private readonly neo4j: Neo4jConnectionService) {}

  async resetDatabase() {
    await this.deleteAll();
    await this.initializeUser();
    await this.initializeIndexes();
  }

  private async initializeUser() {
    const query = 'CREATE (u: User { name: $name }) RETURN u';
    const result = await this.neo4j.createSession('write').run(query, { name: defaultUserName });

    return result;
  }

  private async initializeIndexes() {
    try {
      await this.neo4j.createSession('write').run('CREATE INDEX ON :USER(name)');
    } catch {
      // if index already exists
    }
  }

  private async deleteAll() {
    const query = 'MATCH (n) DETACH DELETE n';
    const result = await this.neo4j.createSession('write').run(query);

    return result;
  }
}
