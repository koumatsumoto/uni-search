import { Component, ElementRef, OnInit } from '@angular/core';
import { UiDataService } from '../../services/ui/ui-data.service';

const createIframe = (src: string) => {
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.style.flex = '1';
  iframe.style.border = 'none';

  return iframe;
};

@Component({
  selector: 'app-search-result-viewer',
  templateUrl: './search-result-viewer.component.html',
  styleUrls: ['./search-result-viewer.component.scss'],
})
export class SearchResultViewerComponent implements OnInit {
  private currentSource = '';
  private iframes = new Map<string, HTMLIFrameElement>();

  constructor(private readonly uiDataService: UiDataService, private readonly elementRef: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.uiDataService.browseTarget.subscribe((item) => {
      if (item.url === this.currentSource) {
        return;
      }

      // changed
      const currentIframe = this.iframes.get(this.currentSource);
      if (currentIframe) {
        currentIframe.style.display = 'none';
      }

      const toView = this.iframes.get(item.url);
      this.currentSource = item.url;
      // use cache if exists
      if (toView) {
        toView.style.display = 'block';
      } else {
        const iframe = createIframe(item.url);
        this.elementRef.nativeElement.appendChild(iframe);
        this.iframes.set(item.url, iframe);
      }
    });
  }
}
