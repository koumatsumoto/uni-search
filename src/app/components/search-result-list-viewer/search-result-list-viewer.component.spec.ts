import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultListViewerComponent } from './search-result-list-viewer.component';

describe('SearchResultListViewerComponent', () => {
  let component: SearchResultListViewerComponent;
  let fixture: ComponentFixture<SearchResultListViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchResultListViewerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultListViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
