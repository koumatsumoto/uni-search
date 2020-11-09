import { Component } from '@angular/core';
import { AppCommandService } from '../../services/app/app-command.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  constructor(private readonly service: AppCommandService) {}

  onSearchBoxSubmit(text: string) {
    this.service.search(text);
  }

  async onDatabaseButtonClick() {
    this.service.openDatabaseInfoDialog();
  }

  onDashboardMenuClick() {
    this.service.viewDashboard();
  }

  onExplorerMenuClick() {
    this.service.viewExplorer();
  }
}
