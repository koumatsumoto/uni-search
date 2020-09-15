import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { googleSearchResultSelectors } from './dom-selector';

export type SearchResult = {
  title: string;
  link: string;
  description: string;
};

export const emptyResult: SearchResult = {
  title: '',
  link: '',
  description: '',
};

const findOrFail = <T extends Element = Element>(selector: string, element: HTMLElement) => {
  const result = element.querySelector(selector);
  if (!result) {
    throw new Error(`ElementNotFound: selector is ${selector}`);
  }

  return result as T;
};

const extractData = (element: HTMLElement) => {
  const title = findOrFail<HTMLHeadingElement>(googleSearchResultSelectors.itemTitle, element);
  const link = findOrFail<HTMLAnchorElement>(googleSearchResultSelectors.itemLink, element);
  const description = findOrFail<HTMLSpanElement>(googleSearchResultSelectors.itemDescription, element);

  return {
    title: title.innerText,
    link: link.href,
    description: description.innerText,
  };
};

const extractResult = (html: string) => {
  const div = document.createElement('div');
  // div.style.display = 'none';
  div.innerHTML = html;
  document.body.appendChild(div);

  const items = div.querySelectorAll<HTMLElement>(googleSearchResultSelectors.item);
  const data = Array.from(items).map((item) => extractData(item));
  document.body.removeChild(div);

  return data;
};

@Injectable({
  providedIn: 'root',
})
export class GoogleSearchGetterService {
  constructor(private readonly http: HttpClient) {}

  async search(query: string) {
    const resultHtml = await this.request(query);
    const results = extractResult(resultHtml);

    return results;
  }

  private async request(query: string, start = 0) {
    return await this.http.get(`https://www.google.com/search?q=${query}&start=${start}`, { responseType: 'text' }).toPromise();
  }
}
