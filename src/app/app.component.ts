import { Component, OnInit } from '@angular/core';
import { GoogleSearchService } from './services/google/google-search.service';
import { SearchResult } from './services/google/extract';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'uni-search';
  searchResults: SearchResult[] = [];
  selectedData: SearchResult | null = null;

  constructor(private readonly googleSearchGetterService: GoogleSearchService) {}

  ngOnInit() {
    // to develop css
    if (!environment.production) {
      this.onSearchBoxSubmit('test').catch();
    }
  }

  selectData(data: SearchResult) {
    console.log(data);

    this.selectedData = data;
  }

  async onSearchBoxSubmit(text: string) {
    console.log('[dev]', text);

    this.searchResults = await this.googleSearchGetterService.search(text);
  }
}
