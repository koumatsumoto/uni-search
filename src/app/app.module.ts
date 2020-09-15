import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DummyHttpClient } from './test-helpers/dummy-http-client';
import { SearchResultCardComponent } from './components/search-result-card/search-result-card.component';

@NgModule({
  declarations: [AppComponent, SearchBoxComponent, SearchResultCardComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule, HttpClientModule],
  providers: [
    {
      provide: HttpClient,
      useClass: DummyHttpClient,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
