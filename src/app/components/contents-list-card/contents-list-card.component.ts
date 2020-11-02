import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Contents } from '../../models/neo4j';

const getGoogleFaviconApi = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}`;

@Component({
  selector: 'app-contents-list-card',
  templateUrl: './contents-list-card.component.html',
  styleUrls: ['./contents-list-card.component.scss'],
})
export class ContentsListCardComponent {
  get iconSrc() {
    return getGoogleFaviconApi(this.data.domain);
  }

  @Input() data!: Contents;

  @Output() clicked = new EventEmitter<Contents>();

  @HostListener('click') click() {
    this.clicked.emit(this.data);
  }
}
