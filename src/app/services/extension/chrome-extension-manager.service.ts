import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

const key = 'contentScriptIsEnabledUntil';
const scriptEnableCheckInterval = 1000 * 25;
const initialCheckDelay = 1000 * 3;

const getContentScriptExpiration = () => Number(document.body.dataset[key]) || 0;
const isScriptWorking = () => {
  return Date.now() < getContentScriptExpiration();
};

@Injectable({
  providedIn: 'root',
})
export class ChromeExtensionManagerService {
  constructor() {}

  get scriptWorkingStatus() {
    return timer(initialCheckDelay, scriptEnableCheckInterval).pipe(
      map(() => isScriptWorking()),
      distinctUntilChanged(),
    );
  }
}
