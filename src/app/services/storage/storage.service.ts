import { Inject, Injectable, InjectionToken } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken('uni-search LocalStorage');

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(@Inject(LOCAL_STORAGE) private readonly storage: Storage) {}

  get<T>(key: string): T | null {
    const value = this.storage.getItem(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value);
  }

  set(key: string, value: unknown) {
    if (value === undefined || value === null) {
      return;
    }

    this.storage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    this.storage.removeItem(key);
  }
}
