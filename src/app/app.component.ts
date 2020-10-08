import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { DatabaseInformationDialogComponent } from './components/dialogs/database-information-dialog/database-information-dialog.component';
import { ExtensionInfoDialogComponent } from './components/dialogs/extension-info-dialog/extension-info-dialog.component';
import { LoginDialogComponent } from './components/dialogs/login-dialog/login-dialog.component';
import { AppQueryService } from './services/app/app-query.service';
import { ChromeExtensionManagerService } from './services/extension/chrome-extension-manager.service';
import { Neo4jAuthService } from './services/neo4j/neo4j-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly queryService: AppQueryService,
    private readonly neo4jLoginService: Neo4jAuthService,
    private readonly chromeExtensionManager: ChromeExtensionManagerService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.queryService.dialogOpenRequest
      .pipe(
        exhaustMap((request) => {
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
      )
      .subscribe();
    // login request will be emitted if not connected to neo4f
    this.neo4jLoginService.init();
    this.chromeExtensionManager.start();
  }
}
