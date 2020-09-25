import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

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

  constructor(private readonly dialogRef: MatDialogRef<LoginDialogComponent, DialogResult>) {}

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close({
      url: this.url.value,
      name: this.name.value,
      password: this.password.value,
    });
  }
}
