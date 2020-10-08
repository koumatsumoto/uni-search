import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { Neo4jLoginService } from './services/neo4j/neo4j-login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private readonly neo4jLoginService: Neo4jLoginService, private readonly dialog: MatDialog) {}

  ngOnInit() {
    // login request will be emitted if not connected to neo4f
    this.neo4jLoginService.loginRequest.subscribe(() => this.dialog.open(LoginDialogComponent));
    this.neo4jLoginService.init();
  }
}
