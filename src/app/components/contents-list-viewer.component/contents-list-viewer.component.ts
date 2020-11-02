import { Component, Input } from '@angular/core';
import { Contents } from '../../models/neo4j';
import { AppCommandService } from '../../services/app/app-command.service';

@Component({
  selector: 'app-contents-list-viewer',
  templateUrl: './contents-list-viewer.component.html',
  styleUrls: ['./contents-list-viewer.component.scss'],
})
export class ContentsListViewerComponent {
  @Input() contents: Contents[] = [];

  constructor(private readonly commandService: AppCommandService) {}

  async onItemSelect(data: Contents) {
    await this.commandService.viewContents(data);
  }

  trackByFn(index: number) {
    return index;
  }
}
