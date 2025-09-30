import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { LocalStorage } from '../../services/localStorage.services';
import { SessionStorage } from '../../services/sessionStorage.service';
import { AuthService } from '../auth.services';
import { DialogBoxServices } from '../../presets/dialog-box.component/dialog-box.services';
import { PageServices } from '../../services/page.services';

import { UserModel } from '../../models/userVM';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login-box',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './login-box.html',
  styleUrl: './login-box.scss'
})
export class LoginBox implements OnInit {

  user: UserModel = {
    Name: '',
    Password: '',
    Email: '',
    Picture: ''
  };

  constructor(private authServices: AuthService, 
    private dialogServices: DialogBoxServices, 
    private dialogRef: MatDialogRef<LoginBox>,
    private localStorage: LocalStorage,
    private sessionStorage: SessionStorage,
    private dialog:MatDialog,
    private router: Router,
    private pageService: PageServices) {
      dialogRef.disableClose = true;
    }

  async ngOnInit(): Promise<void> {
      await this.authServices.whenLoginProcessed;
  }

  validateUser(): boolean{
    if (this.user.Email !== '' || this.user.Email !== null){
      if (this.user.Password !== '' || this.user.Password !== null){
        return true;
      }else{
        this.dialogServices.showValidation("Validation", 'Please enter password.');
        return false;
      }
    }else{
        this.dialogServices.showValidation("Validation", 'Please enter email address.');
        return false;
    }
  }

  login():void{
    if (this.validateUser()){
      this.authServices.localLoginfn(this.user).subscribe({
        next: (response) => {
          if (response.ResponseDetails.Message == 'Success'){
            this.dialogServices.showValidation('Success', 'Authentication successful.')
            .afterClosed()
            .subscribe(() => {
              this.localStorage.storeSession('UserDetails', JSON.stringify(response.ResponseDetails.Data));
              this.localStorage.storeSession('Token', response.Token);
              this.dialogRef.close('0f115f4c-aedf-40bd-864c-0a28fe362fa7');
            })
          }
          else{
             this.dialogServices.showError('Failed', response.ResponseDetails.Message);
          }
        },
        error: (error) => {
          this.dialogServices.showError('Failed', 'Unable to Login.');
        }
      })
    }
  }

  cancel(): void{
    this.dialogRef.close('0f115f4c-aedf-40bd-864c-0a28fe362fa7');
  }

  signup(): void{
    this.authServices.login();
  }

  openForgotPassword(): void{
    const dialogRef = this.dialog.open(ForgotPasswordComponent,{
      width: '300px',
      height: '200px'
    });

    dialogRef.afterClosed().subscribe((response) => {
      this.dialogRef.close(response);
    });
  }
}
