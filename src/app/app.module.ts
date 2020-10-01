import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SearchResultCardComponent } from './components/search-result-card/search-result-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { BrowserComponent } from './components/browser/browser.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { DemoCircleIndicatorsComponent } from './components/demo-circle-indicators/demo-circle-indicators.component';
import { StoreModule } from '@ngrx/store';
import { LOCAL_STORAGE } from './services/storage/storage.service';
import * as coreStore from './store/core.store';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchBoxComponent,
    SearchResultCardComponent,
    BrowserComponent,
    ToolbarComponent,
    DemoCircleIndicatorsComponent,
    LoginDialogComponent,
    SidenavComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature(coreStore.storeName, coreStore.reducer),
  ],
  providers: [{ provide: LOCAL_STORAGE, useValue: window.localStorage }],
  entryComponents: [LoginDialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
