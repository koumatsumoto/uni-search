import { Component, Input, OnInit } from '@angular/core';
import { emptyResult, SearchResult } from '../../services/google-search-getter.service';

@Component({
  selector: 'app-search-result-card',
  templateUrl: './search-result-card.component.html',
  styleUrls: ['./search-result-card.component.scss'],
})
export class SearchResultCardComponent {
  @Input() data: SearchResult = emptyResult;
}
