import { Injectable } from '@angular/core';
import * as neo4j from 'neo4j-driver';
import { Subject } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

const connectionEvents = {
  connectSuccess: 'connection success',
  connectFailure: 'connection failure',
} as const;
type ConnectionEvent = typeof connectionEvents[keyof typeof connectionEvents];

export const isConnectionSuccess = (event: ConnectionEvent) => event === connectionEvents.connectSuccess;

@Injectable({
  providedIn: 'root',
})
export class Neo4jConnectionService {
  private driver: neo4j.Driver | null = null;
  private readonly connectionEvent$ = new Subject<ConnectionEvent>();

  get connectionEvent() {
    return this.connectionEvent$.asObservable();
  }

  constructor(private readonly logger: LoggerService) {}

  connect(options: { url: string; user: string; password: string }) {
    if (!this.driver) {
      this.driver = neo4j.driver(options.url, neo4j.auth.basic(options.user, options.password));
    }

    this.driver
      .verifyConnectivity()
      .then(() => {
        this.connectionEvent$.next(connectionEvents.connectSuccess);
      })
      .catch((e) => {
        this.logger.error(e);
        this.connectionEvent$.next(connectionEvents.connectFailure);
        this.cleanup();
      });
  }

  createSession(mode: 'read' | 'write' = 'write') {
    return mode === 'read' ? this.getReadSession() : this.getWriteSession();
  }

  private cleanup() {
    if (this.driver) {
      this.driver.close().finally(() => {
        this.driver = null;
      });
    }
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
