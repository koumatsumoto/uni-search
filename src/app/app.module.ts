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
import { SearchResultViewerComponent } from './components/search-result-viewer/search-result-viewer.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { DemoCircleIndicatorsComponent } from './components/demo-circle-indicators/demo-circle-indicators.component';
import { StoreModule } from '@ngrx/store';
import * as coreStore from './store/core.store';

@NgModule({
  declarations: [
    AppComponent,
    SearchBoxComponent,
    SearchResultCardComponent,
    SearchResultViewerComponent,
    ToolbarComponent,
    DemoCircleIndicatorsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature(coreStore.storeName, coreStore.reducer),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
