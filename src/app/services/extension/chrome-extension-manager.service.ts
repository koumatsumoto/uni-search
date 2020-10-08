import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as coreStore from '../../store/core.store';
import { AppState } from '../../store/core.store';

const key = 'contentScriptIsEnabledUntil';
const scriptEnableCheckInterval = 1000 * 25;
const initialCheckDelay = 1000 * 2;
const getContentScriptExpiration = () => document.body.dataset[key];

@Injectable({
  providedIn: 'root',
})
export class ChromeExtensionManagerService {
  constructor(private readonly store: Store<AppState>) {}

  start() {
    setTimeout(() => this.check(), initialCheckDelay);
    setInterval(() => this.check(), scriptEnableCheckInterval);
  }

  private check() {
    const expiration = Number(getContentScriptExpiration());

    if (expiration && Date.now() < expiration) {
      this.store.dispatch(coreStore.updateExtensionStatus({ isWorking: true, expiration }));
    } else {
      this.store.dispatch(coreStore.updateExtensionStatus({ isWorking: false, expiration }));
      this.store.dispatch(coreStore.requestDialogOpen({ type: 'extension-info', time: Date.now() }));
    }
  }
}
