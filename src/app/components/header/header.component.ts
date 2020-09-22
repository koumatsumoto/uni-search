import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() searchSubmitted = new EventEmitter<string>();

  async onSearchBoxSubmit(text: string) {
    this.searchSubmitted.emit(text);
  }
}
