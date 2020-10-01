import { Component, ElementRef, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { bufferTime, distinctUntilChanged, map } from 'rxjs/operators';
import { BrowseTarget } from '../../models/core';
import { UiDataService } from '../../services/ui/ui-data.service';

const createIframe = (src: string, onLoaded: () => unknown) => {
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.style.flex = '1';
  iframe.style.border = 'none';
  iframe.addEventListener('load', () => onLoaded(), { once: true });

  return iframe;
};

const distinctOverTime = (time: number) => {
  return <T>(source: Observable<T>) =>
    source.pipe(
      distinctUntilChanged(),
      bufferTime(time),
      map((values) => {
        // - true,false => false
        // - true,false,true => true
        return values.length % 2 === 0 ? values[values.length - 1] : values[0];
      }),
    );
};

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss'],
})
export class BrowserComponent implements OnInit {
  private currentSource = '';
  private iframes = new Map<string, HTMLIFrameElement>();
  private loading = new BehaviorSubject<boolean>(false);

  get loading$() {
    return this.loading.asObservable().pipe(distinctOverTime(100));
  }

  constructor(private readonly uiDataService: UiDataService, private readonly elementRef: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.uiDataService.browseTarget.subscribe((item) => this.changeBrowseTarget(item));
  }

  private changeBrowseTarget(item: BrowseTarget) {
    if (item.url === this.currentSource) {
      return;
    }

    this.loading.next(true);

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
      const iframe = createIframe(item.url, () => {
        this.loading.next(false);
        // console.log('[dev] loading false');
      });
      this.elementRef.nativeElement.appendChild(iframe);
      this.iframes.set(item.url, iframe);
    }
  }
}
