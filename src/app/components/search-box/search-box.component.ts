import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent {
  @Output() submitValue = new EventEmitter<string>();

  readonly inputControl = new FormControl();

  onEnter() {
    const value = String(this.inputControl.value);

    if (value === '') {
      return;
    }

    this.submitValue.emit(value);
  }
}
