import { Component, OnInit } from '@angular/core';
import { BrowseOption } from '../../models/core';
import { AppCommandService } from '../../services/app/app-command.service';
import { AppQueryService } from '../../services/app/app-query.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  items: BrowseOption[] = [];

  constructor(private readonly commandService: AppCommandService, private readonly queryService: AppQueryService) {}

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
