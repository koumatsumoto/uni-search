import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UiCommandService } from '../../services/app/ui-command.service';
import { UiQueryService } from '../../services/app/ui-query.service';

@Component({
  selector: 'app-database-information-dialog',
  templateUrl: './database-information-dialog.component.html',
  styleUrls: ['./database-information-dialog.component.scss'],
})
export class DatabaseInformationDialogComponent implements OnInit {
  totalRecordCount!: Observable<{ low: number; high: number }>;

  constructor(
    private readonly dialogRef: MatDialogRef<DatabaseInformationDialogComponent>,
    private readonly queryService: UiQueryService,
    private readonly commandService: UiCommandService,
  ) {}

  ngOnInit(): void {
    this.totalRecordCount = this.queryService.getTotalRecordCount();
  }

  async onResetButtonClick() {
    await this.commandService.resetDatabase();
    this.dialogRef.close();
  }
}
