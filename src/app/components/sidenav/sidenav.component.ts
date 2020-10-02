import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityLog, SearchResult } from '../../models/core';
import { UiDataService } from '../../services/ui/ui-data.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  items$!: Observable<SearchResult[]>;
  logs$!: Observable<ActivityLog[]>;

  constructor(private readonly uiDataService: UiDataService) {}

  ngOnInit(): void {
    this.items$ = this.uiDataService.searchResults;
    this.logs$ = this.uiDataService.activityLogs;
  }

  async onItemSelect(data: SearchResult) {
    await this.uiDataService.selectSearchResult(data);
  }
}
