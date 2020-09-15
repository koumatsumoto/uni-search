import { html } from './dummy-google-search-response';
import { of } from 'rxjs';

export class DummyHttpClient {
  get() {
    return of(html);
  }
}
