import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, tap } from 'rxjs/operators';
import { AppCommandService } from '../services/app/app-command.service';
import * as coreStore from './core.store';

@Injectable()
export class CoreEffects {
  createActivityOnApplicationReady = createEffect(
    () =>
      this.store.select(coreStore.selectors.selectAppState).pipe(
        first((state) => state.neo4jWorking && state.chromeExtensionWorking),
        tap(() => this.command.startActivity()),
      ),
    { dispatch: false },
  );

  constructor(private readonly store: Store<coreStore.AppState>, private readonly command: AppCommandService) {}
}
