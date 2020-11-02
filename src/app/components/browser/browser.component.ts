import { Component, ElementRef, OnInit } from '@angular/core';
import { BrowseRequest } from '../../models/core';
import { AppQueryService } from '../../services/app/app-query.service';

const createIframe = (src: string, onLoaded: () => unknown) => {
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.style.flex = '1';
  iframe.style.border = 'none';
  iframe.addEventListener('load', () => onLoaded(), { once: true });

  return iframe;
};

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss'],
})
export class BrowserComponent implements OnInit {
  private currentSource = '';
  private iframes = new Map<string, HTMLIFrameElement>();

  constructor(private readonly queryService: AppQueryService, private readonly elementRef: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.queryService.browseRequest.subscribe((item) => this.changeBrowseTarget(item));
  }

  private changeBrowseTarget(item: BrowseRequest) {
    if (item.uri === this.currentSource) {
      return;
    }

    // changed
    const currentIframe = this.iframes.get(this.currentSource);
    if (currentIframe) {
      currentIframe.style.display = 'none';
    }

    const toView = this.iframes.get(item.uri);
    this.currentSource = item.uri;
    // use cache if exists
    if (toView) {
      toView.style.display = 'block';
    } else {
      const iframe = createIframe(item.uri, () => {
        // console.log('[dev] loading false');
      });
      this.elementRef.nativeElement.appendChild(iframe);
      this.iframes.set(item.uri, iframe);
    }
  }
}
