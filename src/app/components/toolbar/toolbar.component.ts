import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Output() commandSubmitted = new EventEmitter<string>();

  async onSearchBoxSubmit(text: string) {
    this.commandSubmitted.emit(text);
  }
}
