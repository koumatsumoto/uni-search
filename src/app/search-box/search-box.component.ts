import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit {
  readonly searchBoxFormControl = new FormControl();
  readonly formGroup = new FormGroup({
    searchBox: this.searchBoxFormControl,
  });

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {}

  async onSubmit() {
    console.log('[dev] form:', this.formGroup);

    if (this.formGroup.errors) {
      return;
    }

    const searchValue = String(this.searchBoxFormControl.value);
    console.log('[dev] searchValue:', searchValue);

    const result = await this.http
      .get(`https://www.google.com/search?q=${searchValue}`, {
        responseType: 'text',
      })
      .toPromise();
    console.log('[dev] result:', result);

    const container = document.getElementById('searchResult');
    if (container) {
      container.innerHTML = result;
    }
  }
}
