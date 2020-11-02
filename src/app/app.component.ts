import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppQueryService } from './services/app/app-query.service';
import * as coreStore from './store/core.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly viewType = this.queryService.viewType;
  readonly contentsList = this.queryService.contents;
  readonly activities = this.queryService.activities;

  constructor(private readonly queryService: AppQueryService, private readonly store: Store<coreStore.AppState>) {}

  ngOnInit() {
    // NOTE: do after ngOnInit completed
    setTimeout(() => this.store.dispatch(coreStore.actions.updateAppStatus({ appComponentInitialized: true })));
  }
}
