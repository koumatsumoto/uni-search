import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AppCommandService } from '../../../services/app/app-command.service';
import { AppQueryService } from '../../../services/app/app-query.service';

@Component({
  selector: 'app-database-information-dialog',
  templateUrl: './database-information-dialog.component.html',
  styleUrls: ['./database-information-dialog.component.scss'],
})
export class DatabaseInformationDialogComponent implements OnInit {
  totalRecordCount!: Observable<{ low: number; high: number }>;

  constructor(
    private readonly dialogRef: MatDialogRef<DatabaseInformationDialogComponent>,
    private readonly queryService: AppQueryService,
    private readonly commandService: AppCommandService,
  ) {}

  ngOnInit(): void {
    this.totalRecordCount = this.queryService.getTotalRecordCount();
  }

  async onResetButtonClick() {
    await this.commandService.resetDatabase();
    this.dialogRef.close();
  }
}
