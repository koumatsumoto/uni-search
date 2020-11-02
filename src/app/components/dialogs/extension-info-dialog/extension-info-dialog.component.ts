import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AppQueryService } from '../../../services/app/app-query.service';

@Component({
  selector: 'app-extension-info-dialog',
  templateUrl: './extension-info-dialog.component.html',
  styleUrls: ['./extension-info-dialog.component.scss'],
})
export class ExtensionInfoDialogComponent {
  readonly isNotWorking = this.queryService.isChromeExtensionNotWorking;

  constructor(private readonly queryService: AppQueryService, private readonly dialogRef: MatDialogRef<ExtensionInfoDialogComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
