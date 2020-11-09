import { Component, Input } from '@angular/core';
import { BrowseOption } from '../../models/core';
import { AppCommandService } from '../../services/app/app-command.service';

@Component({
  selector: 'app-contents-list-viewer',
  templateUrl: './contents-list-viewer.component.html',
  styleUrls: ['./contents-list-viewer.component.scss'],
})
export class ContentsListViewerComponent {
  @Input() contents: BrowseOption[] = [];

  constructor(private readonly commandService: AppCommandService) {}

  async onItemSelect(data: BrowseOption) {
    await this.commandService.selectSearchResult(data);
  }

  trackByFn(index: number) {
    return index;
  }
}
