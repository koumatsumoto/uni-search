import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleSearchResult } from '../../models/core';
import { UiCommandService } from '../../services/app/ui-command.service';
import { UiQueryService } from '../../services/app/ui-query.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  items$!: Observable<GoogleSearchResult[]>;

  constructor(private readonly commandService: UiCommandService, private readonly queryService: UiQueryService) {}

  ngOnInit(): void {
    this.items$ = this.queryService.searchResults;
  }

  async onItemSelect(data: GoogleSearchResult) {
    await this.commandService.selectSearchResult(data);
  }
}
