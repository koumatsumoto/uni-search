import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { SearchResult } from '../../models/core';
import { emptyResult } from '../../services/google/extract';

const getGoogleFaviconApi = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}`;

@Component({
  selector: 'app-search-result-card',
  templateUrl: './search-result-card.component.html',
  styleUrls: ['./search-result-card.component.scss'],
})
export class SearchResultCardComponent {
  get iconSrc() {
    return getGoogleFaviconApi(this.data.domain);
  }

  @Input() data: SearchResult = emptyResult;
  @Output() clicked = new EventEmitter<SearchResult>();
  @HostListener('click') click() {
    this.clicked.emit(this.data);
  }
}
