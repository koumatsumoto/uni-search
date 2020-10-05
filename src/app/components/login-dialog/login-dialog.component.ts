import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UiDataService } from '../../services/ui/ui-data.service';

export type DialogResult = { url: string; name: string; password: string };

@Component({
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements OnInit {
  url!: FormControl;
  user!: FormControl;
  password!: FormControl;
  form!: FormGroup;

  constructor(
    private readonly dialogRef: MatDialogRef<LoginDialogComponent, DialogResult>,
    private readonly uiDataService: UiDataService,
  ) {}

  ngOnInit() {
    const cache = this.uiDataService.cachedLoginInformation;

    this.url = new FormControl(cache.url, Validators.required);
    this.user = new FormControl(cache.user, Validators.required);
    this.password = new FormControl(cache.password, Validators.required);
    this.form = new FormGroup({
      url: this.url,
      name: this.user,
      password: this.password,
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.uiDataService.submitLoginForm({
      url: this.url.value,
      user: this.user.value,
      password: this.password.value,
    });
    this.dialogRef.close();
  }
}
