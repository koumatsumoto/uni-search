import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CytoscapeComponent } from './cytoscape.component';

describe('GraphViewerComponent', () => {
  let component: CytoscapeComponent;
  let fixture: ComponentFixture<CytoscapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CytoscapeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CytoscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
