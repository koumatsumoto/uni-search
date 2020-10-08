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
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserComponent } from './components/browser/browser.component';
import { DatabaseInformationDialogComponent } from './components/database-information-dialog/database-information-dialog.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { SearchResultCardComponent } from './components/search-result-card/search-result-card.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LOCAL_STORAGE } from './services/storage/storage.service';
import * as coreStore from './store/core.store';

@NgModule({
  declarations: [
    AppComponent,
    SearchBoxComponent,
    SearchResultCardComponent,
    BrowserComponent,
    ToolbarComponent,
    LoginDialogComponent,
    SidenavComponent,
    DatabaseInformationDialogComponent,
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
  ],
  providers: [{ provide: LOCAL_STORAGE, useValue: window.localStorage }],
  entryComponents: [LoginDialogComponent, DatabaseInformationDialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
