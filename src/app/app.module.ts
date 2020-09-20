import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DummyHttpClient } from './test-helpers/dummy-http-client';
import { SearchResultCardComponent } from './components/search-result-card/search-result-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { SearchResultViewerComponent } from './components/search-result-viewer/search-result-viewer.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, SearchBoxComponent, SearchResultCardComponent, SearchResultViewerComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule, MatCardModule],
  providers: [
    {
      provide: HttpClient,
      useClass: !environment.production ? DummyHttpClient : HttpClient,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
