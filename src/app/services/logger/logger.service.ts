import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

type LogData = {
  time: number;
  type: 'debug' | 'info' | 'error';
  data: unknown;
};

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private logStream = new Subject<LogData>();

  get logs() {
    return this.logStream.asObservable();
  }

  debug(...args: unknown[]) {
    this.log('debug', args);
  }

  info(...args: unknown[]) {
    this.log('info', args);
  }

  error(...args: unknown[]) {
    this.log('error', args);
  }

  private log(type: LogData['type'], data: unknown[]) {
    this.logStream.next({
      type,
      time: Date.now(),
      data,
    });
  }
}
