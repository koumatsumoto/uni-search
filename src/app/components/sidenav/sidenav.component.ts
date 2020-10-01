import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResult } from '../../models/core';
import { UiDataService } from '../../services/ui/ui-data.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  items$!: Observable<SearchResult[]>;

  constructor(private readonly uiDataService: UiDataService) {}

  ngOnInit(): void {
    this.items$ = this.uiDataService.searchResults;
  }

  async onItemSelect(data: SearchResult) {
    await this.uiDataService.selectSearchResult(data);
  }
}
