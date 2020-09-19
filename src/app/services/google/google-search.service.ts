import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { extractResult } from './extract';

@Injectable({
  providedIn: 'root',
})
export class GoogleSearchService {
  constructor(private readonly http: HttpClient) {}

  async search(query: string) {
    const resultHtml = await this.request(query);

    return extractResult(resultHtml);
  }

  private async request(query: string, start = 0) {
    return await this.http.get(`https://www.google.com/search?q=${query}&start=${start}`, { responseType: 'text' }).toPromise();
  }
}
