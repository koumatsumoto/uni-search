import { Component, OnInit } from '@angular/core';
import { BrowseOption } from '../../models/core';
import { UiCommandService } from '../../services/app/ui-command.service';
import { UiQueryService } from '../../services/app/ui-query.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  items: BrowseOption[] = [];

  constructor(private readonly commandService: UiCommandService, private readonly queryService: UiQueryService) {}

  ngOnInit(): void {
    this.queryService.searchResultList.subscribe((items) => (this.items = items));
  }

  async onItemSelect(data: BrowseOption) {
    await this.commandService.selectSearchResult(data);
  }

  trackByFn(index: number) {
    return index;
  }
}
