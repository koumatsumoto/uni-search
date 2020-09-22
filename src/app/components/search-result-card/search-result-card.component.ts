import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { emptyResult, SearchResult } from '../../services/google/extract';

@Component({
  selector: 'app-search-result-card',
  templateUrl: './search-result-card.component.html',
  styleUrls: ['./search-result-card.component.scss'],
})
export class SearchResultCardComponent {
  @Input() data: SearchResult = emptyResult;
  @Output() clicked = new EventEmitter<SearchResult>();
  @HostListener('click') click() {
    this.clicked.emit(this.data);
  }
}
