import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { extractResult } from './extract';

const getGoogleSearchUrl = (query: string, offset: number) => `https://www.google.com/search?q=${query}&start=${offset}`;

@Injectable({
  providedIn: 'root',
})
export class GoogleSearchService {
  constructor(private readonly http: HttpClient) {}

  async search(query: string) {
    const resultHtml = await this.request(query);
    const parseResult = extractResult(resultHtml);

    return parseResult.success;
  }

  private async request(query: string, start = 0) {
    return await this.http.get(getGoogleSearchUrl(query, start), { responseType: 'text' }).toPromise();
  }
}
