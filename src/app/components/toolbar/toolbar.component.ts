import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Output() searchSubmitted = new EventEmitter<string>();

  async onSearchBoxSubmit(text: string) {
    this.searchSubmitted.emit(text);
  }
}
