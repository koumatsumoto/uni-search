import { Component, OnInit } from '@angular/core';
import { GoogleSearchService } from './services/google/google-search.service';
import { SearchResult } from './services/google/extract';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'uni-search';
  searchResults: SearchResult[] = [];

  constructor(private readonly googleSearchGetterService: GoogleSearchService) {}

  ngOnInit() {
    // to develop css
    this.onSearchBoxSubmit('test');
  }

  async onSearchBoxSubmit(text: string) {
    this.searchResults = await this.googleSearchGetterService.search(text);
  }
}
