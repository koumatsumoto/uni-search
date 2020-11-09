import { Injectable } from '@angular/core';
import Transaction from 'neo4j-driver/types/transaction';
import { Activity, Contents, Search, Word } from '../../models/neo4j';
import { Neo4jConnectionService } from './neo4j-connection.service';
import { getSingleNode, getSingleRelationship, returnFirstOrNull } from './util';

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

  async startView(contents: Contents, search: Search) {
    const session = this.neo4j.createSession();
    const tx = session.beginTransaction();

    try {
      const [updatedContents] = await Promise.all([
        this.incrementBrowseCount(contents),
        this.createRelationshipForView({ searchId: search.id, contentsId: contents.id }),
      ]);
      await tx.commit();

      return updatedContents;
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  }

  async incrementBrowseCount(contents: Contents): Promise<Contents> {
    const query = `
      MATCH (n: Contents)
      WHERE ID(n) = toInteger($id)
      SET n += { updatedAt: timestamp(), browseCount: n.browseCount + 1 }
      RETURN n;
    `;
    const result = await this.neo4j.createSession().run(query, contents);
    const record = result.records[0];

    return getSingleNode<Contents>(record);
  }

  async startSearch(
    wordParam: Pick<Word, 'uri' | 'name'>,
    activityId: number,
    contentsParams: Pick<Contents, 'uri' | 'title' | 'domain'>[],
  ) {
    const session = this.neo4j.createSession();
    const tx = session.beginTransaction();

    let word: Word;
    let search: Search;
    let contents: Contents[];

    // TODO: integrate two transactions
    try {
      word = await this.mergeWord(wordParam, tx);
      search = await this.createSearch({ activityId }, tx);
      contents = await this.mergeMultipleContents(contentsParams, tx);
      await tx.commit();
    } catch (e) {
      await tx.rollback();
      throw e;
    }

    const tx2 = session.beginTransaction();
    try {
      await this.createRelationsForSearch(
        { activityId, searchId: search.id, wordId: word.id, contentsIds: contents.map((c) => c.id) },
        tx2,
      );
      await tx2.commit();
    } catch (e) {
      await tx2.rollback();
      throw e;
    }

    return { activityId, word, search, contents };
  }

  private async mergeWord(value: Pick<Word, 'uri' | 'name'>, tx?: Transaction): Promise<Word> {
    const session = tx ?? this.neo4j.createSession();
    const query = `
      MERGE (n: Word {uri: $uri})
        ON CREATE SET n = { uri: $uri, name: $name, searchCount: 1, createdAt: timestamp(), updatedAt: timestamp() }
        ON MATCH SET n += { name: $name, searchCount: n.searchCount + 1, updatedAt: timestamp() }
      RETURN n;
    `;

    const result = await session.run(query, value);
    const record = result.records[0];

    return getSingleNode<Word>(record);
  }

  private async createSearch(value: { activityId: number }, tx?: Transaction): Promise<Search> {
    const session = tx ?? this.neo4j.createSession();
    const query = `CREATE (s:Search) RETURN s;`;

    const result = await session.run(query, value);
    const record = result.records[0];

    return getSingleNode<Search>(record);
  }

  async mergeContents(value: Pick<Contents, 'uri' | 'title' | 'domain'>, tx?: Transaction): Promise<Contents> {
    const session = tx ?? this.neo4j.createSession();
    const query = `
      MERGE (n:Contents {uri: $uri})
        ON CREATE SET n = { title: $title, domain: $domain, createdAt: timestamp(), updatedAt: timestamp(), searchHitCount: 1, browseCount: 0, uri: $uri }
        ON MATCH SET n += { title: $title, domain: $domain, updatedAt: timestamp(), searchHitCount: n.searchHitCount + 1 }
      RETURN n;
    `;

    const result = await session.run(query, value);
    const record = result.records[0];

    return getSingleNode<Contents>(record);
  }

  async mergeMultipleContents(values: Pick<Contents, 'uri' | 'title' | 'domain'>[], tx?: Transaction): Promise<Contents[]> {
    return Promise.all(values.map((v) => this.mergeContents(v, tx)));
  }

  async createRelationsForSearch(
    value: { activityId: Activity['id']; wordId: Word['id']; searchId: Search['id']; contentsIds: Contents['id'][] },
    tx?: Transaction,
  ) {
    const session = tx ?? this.neo4j.createSession();

    // Activity -> Search
    const relateActivityAndSearch = () =>
      session.run(
        `
          MATCH (a:Activity), (b:Search)
          WHERE ID(a) = toInteger($activityId) AND ID(b) = toInteger($searchId)
          CREATE (a)-[r:ACT]->(b);
        `,
        value,
      );

    // Search -> Word
    const relateSearchAndWord = () =>
      session.run(
        `
          MATCH (a:Search), (b:Word)
          WHERE ID(a) = toInteger($searchId) AND ID(b) = toInteger($wordId)
          CREATE (a)-[r:TARGET]->(b);
        `,
        value,
      );

    // Search -> Contents
    const relateSearchAndContents = () =>
      Promise.all(
        value.contentsIds.map((contentsId) =>
          session.run(
            `
              MATCH (a:Search), (b:Contents)
              WHERE ID(a) = toInteger($searchId) AND ID(b) = toInteger($contentsId)
              CREATE (a)-[r:FIND]->(b);
            `,
            { searchId: value.searchId, contentsId },
          ),
        ),
      );

    await Promise.all([relateActivityAndSearch(), relateSearchAndWord(), relateSearchAndContents()]);
  }

  async createRelationshipForView(value: { searchId: Search['id']; contentsId: Contents['id'] }, tx?: Transaction) {
    const session = tx ?? this.neo4j.createSession();
    await session.run(
      `
        MATCH (a:Search), (b:Contents)
        WHERE ID(a) = toInteger($searchId) AND ID(b) = toInteger($contentsId)
        CREATE (a)-[r:VIEW]->(b);
      `,
      value,
    );
  }

  async createActivity(value: { name: string }) {
    const query = `CREATE (n:Activity { name: $name, time: timestamp(), location: '' }) RETURN n;`;
    const result = await this.neo4j.createSession().run(query, value);

    const record = result.records[0];
    return getSingleNode<Activity>(record);
  }

  async findActivities() {
    const query = `MATCH (n:Activity) RETURN n LIMIT 10;`;
    const result = await this.neo4j.createSession().run(query);

    return result.records.map((r) => getSingleNode(r) as Activity); // TODO: bad type assertion
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
