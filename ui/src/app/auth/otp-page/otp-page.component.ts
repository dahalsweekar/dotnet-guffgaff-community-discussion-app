import { Component, Inject } from '@angular/core';
import { UserService } from '../../services/user.services';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Router } from '@angular/router';

import { DialogBoxServices } from '../../presets/dialog-box.component/dialog-box.services';

@Component({
  selector: 'app-otp-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
  templateUrl: './otp-page.component.html',
  styleUrl: './otp-page.component.scss',
})
export class OtpPageComponent {
  otpForm!: FormGroup;
  otpPackage = {
    ToEmail: '',
    otp: '',
  };
  otpLength = 6;
  EmailAddress: string = '';
  timeRemaining = 60000;
  timerInterval: any;
  totalTimeinMinutes = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userServices:UserService,
    private router: Router,
    private dialogServices: DialogBoxServices,
    private dialogRef: MatDialogRef<any>,
    private dialog:MatDialog
  ) {}

  ngOnInit(): void {
    this.EmailAddress = this.data.email;
    this.otpForm = this.fb.group({
      0: ['', [Validators.required, Validators.pattern('[0-9]')]],
      1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      4: ['', [Validators.required, Validators.pattern('[0-9]')]],
      5: ['', [Validators.required, Validators.pattern('[0-9]')]],
    });
    this.startTimer();
  }

  get otpControls() {
    return Object.keys(this.otpForm.controls);
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const val = input.value;

    if (val.length > 1) {
      input.value = val.charAt(0);
    }

    if (/^[0-9]$/.test(input.value)) {
      const nextInput = input.parentElement?.nextElementSibling?.querySelector(
        'input'
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    } else {
      input.value = '';
    }
  }

  onBackspace(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.value === '') {
      const prevInput =
        input.parentElement?.previousElementSibling?.querySelector(
          'input'
        ) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onSubmitOTP() {
    if (this.otpForm.valid) {
      this.wrapOTP();
      this.userServices.verifyOTPfn(this.otpPackage).subscribe({
        next: (response) => {
          this.dialogServices
            .showInfo('Success', 'Verification Sucessful')
            .afterClosed()
            .subscribe(() => {
              this.dialog.closeAll();
              clearInterval(this.timerInterval);
              this.router.navigateByUrl('/newpassword');
            });
        },
        error: (error) => {
          clearInterval(this.timerInterval);
          this.dialogServices.showError('Error', 'Error verifying OTP');
        },
      });
    }
  }

  wrapOTP() {
    this.otpPackage.ToEmail = this.EmailAddress;
    this.otpPackage.otp = Object.values(this.otpForm.value).join('');
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timeRemaining = 820;
    let temp = this.timeRemaining / 60;
    let seconds = 60;

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.totalTimeinMinutes = Math.floor(Math.round(temp - 1)) + ':' + seconds-- + ' minutes'
      
      if (seconds == 0){
        temp--;
        seconds = 60;
      }

      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        clearInterval(this.timerInterval);
        this.dialogServices.showValidation('Validation', 'Your one-time password has expired. Please try again.')
        .afterClosed()
        .subscribe(() => {
          this.dialogRef.close();
        })
      }
    }, 1000);
  }

  onCancel(): void{
    this.dialog.closeAll();
  }
}
