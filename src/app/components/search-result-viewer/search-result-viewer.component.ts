import { Component, Input, OnInit } from '@angular/core';
import { SearchResult } from '../../services/google/extract';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-search-result-viewer',
  templateUrl: './search-result-viewer.component.html',
  styleUrls: ['./search-result-viewer.component.scss'],
})
export class SearchResultViewerComponent implements OnInit {
  @Input() data: SearchResult | null = null;

  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {}
}
