import { Component, OnInit } from '@angular/core';
import { GoogleSearchGetterService, SearchResult } from './services/google-search-getter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'uni-search';
  searchResults: SearchResult[] = [];

  constructor(private readonly googleSearchGetterService: GoogleSearchGetterService) {}

  ngOnInit() {
    // to develop css
    this.onSearchBoxSubmit('test');
  }

  async onSearchBoxSubmit(text: string) {
    this.searchResults = await this.googleSearchGetterService.search(text);
  }
}
