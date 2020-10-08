import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseInformationDialogComponent } from './components/database-information-dialog/database-information-dialog.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { UiQueryService } from './services/app/ui-query.service';
import { Neo4jAuthService } from './services/neo4j/neo4j-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly queryService: UiQueryService,
    private readonly neo4jLoginService: Neo4jAuthService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.queryService.dialogOpenRequest.subscribe((request) => {
      switch (request.type) {
        case 'database-info': {
          return this.dialog.open(DatabaseInformationDialogComponent);
        }
        case 'login': {
          return this.dialog.open(LoginDialogComponent);
        }
        default: {
          return;
        }
      }
    });
    // login request will be emitted if not connected to neo4f
    this.neo4jLoginService.init();
  }
}
