import { html } from './dummy-google-search-response.html';
import { of } from 'rxjs';

export class DummyHttpClient {
  get() {
    return of(html);
  }
}
