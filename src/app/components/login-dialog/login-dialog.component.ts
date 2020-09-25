import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UiDataService } from '../../services/ui/ui-data.service';

export type DialogResult = { url: string; name: string; password: string };

@Component({
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent {
  url = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  form = new FormGroup({
    url: this.url,
    name: this.name,
    password: this.password,
  });

  constructor(
    private readonly dialogRef: MatDialogRef<LoginDialogComponent, DialogResult>,
    private readonly uiDataService: UiDataService,
  ) {}

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.uiDataService.submitLoginForm({
      url: this.url.value,
      user: this.name.value,
      password: this.password.value,
    });
    this.dialogRef.close();
  }
}
