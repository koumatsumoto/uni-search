import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { BrowseOption, GoogleSearchResult } from '../../models/core';

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

  @Input() data!: BrowseOption;
  @Output() clicked = new EventEmitter<GoogleSearchResult>();
  @HostListener('click') click() {
    this.clicked.emit(this.data);
  }
}
