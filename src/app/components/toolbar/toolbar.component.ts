import { Component } from '@angular/core';
import { UiCommandService } from '../../services/app/ui-command.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  constructor(private readonly service: UiCommandService) {}

  onSearchBoxSubmit(text: string) {
    this.service.search(text);
  }

  async onDatabaseButtonClick() {
    this.service.openDatabaseInfoDialog();
  }
}
