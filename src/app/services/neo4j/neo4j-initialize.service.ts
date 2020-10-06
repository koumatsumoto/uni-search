import { Injectable } from '@angular/core';
import { Neo4jConnectionService } from './neo4j-connection.service';

const defaultUserName = 'main user';

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
    await this.initializeUser();
    await this.initializeIndexes();
  }

  private async initializeUser() {
    const query = 'CREATE (u: User { name: $name }) RETURN u';
    const result = await this.neo4j.createSession().run(query, { name: defaultUserName });

    return result;
  }

  private async initializeIndexes() {
    await ignoreError(() => this.neo4j.createSession().run('DROP INDEX ON:USER(name)'));
    await ignoreError(() => this.neo4j.createSession().run('CREATE CONSTRAINT ON (n:USER) ASSERT n.name IS UNIQUE;'));
    await ignoreError(() => this.neo4j.createSession().run('DROP INDEX ON:WebContents(uri)'));
    await ignoreError(() => this.neo4j.createSession().run('CREATE CONSTRAINT ON (n:WebContents) ASSERT n.uri IS UNIQUE;'));
  }

  private async deleteAll() {
    const query = 'MATCH (n) DETACH DELETE n';
    const result = await this.neo4j.createSession().run(query);

    return result;
  }
}
