import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseInformationDialogComponent } from './database-information-dialog.component';

describe('DatabaseInformationDialogComponent', () => {
  let component: DatabaseInformationDialogComponent;
  let fixture: ComponentFixture<DatabaseInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatabaseInformationDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
