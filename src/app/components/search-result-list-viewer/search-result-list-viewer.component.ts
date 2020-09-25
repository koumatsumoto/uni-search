import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResult } from '../../models/core';
import { UiDataService } from '../../services/ui/ui-data.service';

@Component({
  selector: 'app-search-result-list-viewer',
  templateUrl: './search-result-list-viewer.component.html',
  styleUrls: ['./search-result-list-viewer.component.scss'],
})
export class SearchResultListViewerComponent implements OnInit {
  items$!: Observable<SearchResult[]>;

  constructor(private readonly uiDataService: UiDataService) {}

  ngOnInit(): void {
    this.items$ = this.uiDataService.searchResults;
  }

  async onItemSelect(data: SearchResult) {
    await this.uiDataService.selectSearchResult(data);
  }
}
