import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActivityListViewerComponent } from './components/activity-list-viewer.component/activity-list-viewer.component';
import { BrowserComponent } from './components/browser/browser.component';
import { ContentsListViewerComponent } from './components/contents-list-viewer.component/contents-list-viewer.component';
import { CytoscapeComponent } from './components/cytoscape/cytoscape.component';
import { DatabaseInformationDialogComponent } from './components/dialogs/database-information-dialog/database-information-dialog.component';
import { ExtensionInfoDialogComponent } from './components/dialogs/extension-info-dialog/extension-info-dialog.component';
import { LoginDialogComponent } from './components/dialogs/login-dialog/login-dialog.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { SearchResultCardComponent } from './components/search-result-card/search-result-card.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LOCAL_STORAGE } from './services/storage/storage.service';
import { CoreEffects } from './store/core.effects';
import * as coreStore from './store/core.store';
import { ActivityCardComponent } from './components/activity-card/activity-card.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchBoxComponent,
    SearchResultCardComponent,
    BrowserComponent,
    ToolbarComponent,
    LoginDialogComponent,
    ContentsListViewerComponent,
    DatabaseInformationDialogComponent,
    ExtensionInfoDialogComponent,
    CytoscapeComponent,
    ActivityListViewerComponent,
    ActivityCardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature(coreStore.storeName, coreStore.reducer),
    StoreDevtoolsModule.instrument({
      maxAge: 30, // Retains last 30 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    ReactiveComponentModule,
    EffectsModule.forRoot([CoreEffects]),
  ],
  providers: [{ provide: LOCAL_STORAGE, useValue: window.localStorage }],
  entryComponents: [LoginDialogComponent, DatabaseInformationDialogComponent, ExtensionInfoDialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
