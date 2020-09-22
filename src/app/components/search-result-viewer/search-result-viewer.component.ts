import { Component, ElementRef, Input } from '@angular/core';
import { SearchResult } from '../../services/google/extract';

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
export class SearchResultViewerComponent {
  private currentSource = '';
  private iframes = new Map<string, HTMLIFrameElement>();

  @Input() set data(newData: SearchResult | null) {
    // onInit or invalid data
    if (newData === null) {
      return;
    }
    // no change
    if (newData.href === this.currentSource) {
      return;
    }
    // changed
    const currentIframe = this.iframes.get(this.currentSource);
    if (currentIframe) {
      currentIframe.style.display = 'none';
    }

    const toView = this.iframes.get(newData.href);
    this.currentSource = newData.href;
    // use cache if exists
    if (toView) {
      toView.style.display = 'block';
    } else {
      const iframe = createIframe(newData.href);
      this.elementRef.nativeElement.appendChild(iframe);
      this.iframes.set(newData.href, iframe);
    }
  }

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}
}
