import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultViewerComponent } from './search-result-viewer.component';

describe('SearchResultViewerComponent', () => {
  let component: SearchResultViewerComponent;
  let fixture: ComponentFixture<SearchResultViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchResultViewerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
