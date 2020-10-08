import { Injectable } from '@angular/core';
import * as neo4j from 'neo4j-driver';
import { ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class Neo4jConnectionService {
  private driver: neo4j.Driver | null = null;
  private readonly connectStatus$ = new ReplaySubject<boolean>(1);

  get connectStatus() {
    return this.connectStatus$.asObservable();
  }

  constructor(private readonly logger: LoggerService) {}

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

  createSession(mode: 'read' | 'write' = 'read') {
    return mode === 'read' ? this.getReadSession() : this.getWriteSession();
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
