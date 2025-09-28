import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OtpPageComponent } from '../otp-page/otp-page.component';
import { CommonModule } from '@angular/common';
import { DialogBoxServices } from '../../presets/dialog-box.component/dialog-box.services';
import { UserService } from '../../services/user.services';
import { AuthService } from '../auth.services';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserModel } from '../../models/userVM';
import { LocalStorage } from '../../services/localStorage.services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule, FormsModule, MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  MatIconModule],
})
export class ForgotPasswordComponent {
   ForgotPasswordForm = new FormGroup({
    email: new FormControl('')
  });

  emailPackage = {
    otp: '',
    ToEmail: ''
  }

  user: UserModel = {
    Name: '',
    Email: '',
    Picture: '',
    Password: ''
  }
  Email: string =''
  otpKey: string = ''
  isSent: boolean = false;

  isValidUser: boolean = false;

  constructor(
     private userServices: UserService,
      private dialog: MatDialog,
       private dialogBoxServices: DialogBoxServices,
       private authService: AuthService,
       private localStorage:LocalStorage
      ) {  }

  validateCredentials(){
    if (this.Email != ''){
      this.user.Email = this.Email;
      this.authService.validateUserfn(this.user).subscribe({
        next:(next) =>{
          this.sendEmail(next._message);
        },
        error:(error)=>{
          this.dialogBoxServices.showError("Error", "Failed to validate user");
        }
      });
  }
}

  sendEmail(message: string) {
    if(message == 'Ja'){
      this.wrapPackage();
      this.isSent = true;
      this.userServices.sendEmailfn(this.emailPackage).subscribe({
        next: (response) => {
          if(response._message == "Email Sent."){
            const dialogRef = this.dialog.open(OtpPageComponent,{
                data: {
                  email: this.emailPackage.ToEmail
                }
              }
            );
            //this.localStorage.storeSession('UserIdforNewPassword', this.userDetails.UserID);
            dialogRef.afterClosed().subscribe(() => {
              this.emailPackage.otp = '';
              this.emailPackage.ToEmail = '';
            });
          }else
          {
            this.isSent = false;
            this.dialogBoxServices.showError("Failed", response._message);
          }
        },
        error: (error) =>{
          this.isSent = false;
          this.dialogBoxServices.showError("Failed", "Failed to send an email");
        }
      });
    }
    else{
       this.isSent = false;
       this.dialogBoxServices.showError("Failed", "User does not exist");
    }
  }

  onCancelBtn(){
    this.dialog.closeAll();
  }

  getEmail(): string{
    return this.ForgotPasswordForm.get('email')?.value || '';
  }

  generateOtp(length: number = 6): string {
  for (let i = 0; i < length; i++) {
    this.otpKey += Math.floor(Math.random() * 10);
  }
  return this.otpKey;
}

  wrapPackage(){
  this.emailPackage.otp = this.generateOtp();
  this.emailPackage.ToEmail = this.Email;
}

onCancelClick(): void{
  this.dialog.closeAll();
}
}
