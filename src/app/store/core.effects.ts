import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { concatMap, filter, first, mergeMap, tap } from 'rxjs/operators';
import { DatabaseInformationDialogComponent } from '../components/dialogs/database-information-dialog/database-information-dialog.component';
import { ExtensionInfoDialogComponent } from '../components/dialogs/extension-info-dialog/extension-info-dialog.component';
import { LoginDialogComponent } from '../components/dialogs/login-dialog/login-dialog.component';
import { AppCommandService } from '../services/app/app-command.service';
import { ChromeExtensionManagerService } from '../services/extension/chrome-extension-manager.service';
import { isConnectionSuccess, Neo4jConnectionService } from '../services/neo4j/neo4j-connection.service';
import { AppStorageService } from '../services/storage/app-storage.service';
import { isNotNull } from '../services/util/functions';
import * as coreStore from './core.store';

const noDispatchAction = { dispatch: false };

@Injectable()
export class CoreEffects {
  checkChromeExtensionStatusAfterAppComponentInit = createEffect(
    () =>
      this.store.select(coreStore.selectors.selectAppState).pipe(
        first((status) => status.appComponentInitialized),
        // NOTE: use startWith to emit first value
        mergeMap(() => this.chromeExtension.scriptWorkingStatus),
        tap((status) => {
          if (status) {
            this.store.dispatch(coreStore.actions.updateAppStatus({ chromeExtensionWorking: true }));
          } else {
            this.store.dispatch(coreStore.actions.updateAppStatus({ chromeExtensionWorking: false }));
            this.store.dispatch(coreStore.requestDialogOpen({ type: 'extension-info', time: Date.now() }));
          }
        }),
      ),
    noDispatchAction,
  );

  setupNeo4jAuthManagementAfterAppcomponentInit = createEffect(
    () =>
      this.store.pipe(
        select(coreStore.selectors.selectAppState),
        first((status) => status.appComponentInitialized),
        tap(() => {
          const cache = this.storage.loadNeo4jAuth();

          if (cache) {
            this.neo4j.connect(cache);
          }
        }),
        concatMap(() => this.neo4j.connectionEvent),
        tap((event) => {
          if (isConnectionSuccess(event)) {
            this.store.dispatch(coreStore.actions.updateAppStatus({ neo4jWorking: true }));
          } else {
            this.store.dispatch(coreStore.actions.updateAppStatus({ neo4jWorking: false }));
            this.store.dispatch(coreStore.actions.requestDialogOpen({ type: 'login', time: Date.now() }));
          }
        }),
      ),
    noDispatchAction,
  );

  createActivityOnApplicationReady = createEffect(
    () =>
      this.store.pipe(
        select(coreStore.selectors.selectAppState),
        first((state) => state.appComponentInitialized === true && state.neo4jWorking === true && state.chromeExtensionWorking === true),
        tap(() => {
          this.command.startActivity();
        }),
      ),
    noDispatchAction,
  );

  openDialog = createEffect(
    () =>
      this.store.select(coreStore.selectors.selectDialogOpenRequest).pipe(
        filter(isNotNull),
        concatMap((request) => {
          switch (request.type) {
            case 'database-info': {
              return this.dialog.open(DatabaseInformationDialogComponent).afterClosed();
            }
            case 'login': {
              return this.dialog.open(LoginDialogComponent).afterClosed();
            }
            case 'extension-info': {
              return this.dialog.open(ExtensionInfoDialogComponent, { disableClose: true }).afterClosed();
            }
            default: {
              return throwError(new Error('InvalidArgument'));
            }
          }
        }),
      ),
    noDispatchAction,
  );

  constructor(
    private readonly store: Store<coreStore.AppState>,
    private readonly storage: AppStorageService,
    private readonly command: AppCommandService,
    private readonly chromeExtension: ChromeExtensionManagerService,
    private readonly neo4j: Neo4jConnectionService,
    private readonly dialog: MatDialog,
  ) {}
}
