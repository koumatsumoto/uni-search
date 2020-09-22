import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoCircleIndicatorsComponent } from './demo-circle-indicators.component';

describe('DemoCircleIndicatorsComponent', () => {
  let component: DemoCircleIndicatorsComponent;
  let fixture: ComponentFixture<DemoCircleIndicatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemoCircleIndicatorsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoCircleIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
