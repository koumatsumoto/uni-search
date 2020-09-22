import { Component, OnInit } from '@angular/core';
import { GoogleSearchService } from './services/google/google-search.service';
import { SearchResult } from './services/google/extract';
import { Neo4jService } from './services/neo4j/neo4j.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'uni-search';
  searchResults: SearchResult[] = [];
  selected: { href: string } | null = null;

  constructor(private readonly googleSearchGetterService: GoogleSearchService, private readonly neo4jService: Neo4jService) {}

  ngOnInit() {}

  async onItemSelect(data: SearchResult) {
    this.selected = data;
    // cypher-query
    await this.neo4jService.forSelectedItem(data);
  }

  async onCommandSubmit(text: string) {
    this.selected = { href: `https://www.google.com/search?q=${text}` };
    this.searchResults = await this.googleSearchGetterService.search(text);
  }
}
