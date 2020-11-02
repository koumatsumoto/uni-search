import { Injectable } from '@angular/core';
import { Neo4jAuth } from '../../models/neo4j';
import { StorageService } from './storage.service';

const storageKeys = {
  neo4jAuth: 'app/saveNeo4jAuth',
};

@Injectable({
  providedIn: 'root',
})
export class AppStorageService {
  constructor(private readonly storage: StorageService) {}

  saveNeo4jAuth(value: Neo4jAuth) {
    this.storage.set(storageKeys.neo4jAuth, value);
  }

  loadNeo4jAuth() {
    return this.storage.get<Neo4jAuth>(storageKeys.neo4jAuth);
  }
}
