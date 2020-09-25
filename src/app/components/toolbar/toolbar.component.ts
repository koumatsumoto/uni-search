import { Component } from '@angular/core';
import { UiDataService } from '../../services/ui/ui-data.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  constructor(private readonly service: UiDataService) {}

  async onSearchBoxSubmit(text: string) {
    await this.service.submitCommand(text);
  }
}
