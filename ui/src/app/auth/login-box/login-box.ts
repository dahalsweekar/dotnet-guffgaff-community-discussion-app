import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { LocalStorage } from '../../services/localStorage.services';
import { AuthService } from '../auth.services';
import { DialogBoxServices } from '../../presets/dialog-box.component/dialog-box.services';

import { UserModel } from '../../models/userVM';

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
    private localStorage: LocalStorage) {}

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
          this.dialogServices.showInfo('Success', 'You are logged in.')
          .afterClosed()
          .subscribe(() => {
            this.localStorage.storeSession('UserID', this.user.Email)
            this.localStorage.storeSession('Token', response.Token);
            this.dialogRef.close();
          })
        },
        error: (error) => {
          this.dialogServices.showInfo('Failed', 'Unable to login.');
        }
      })
    }
  }

  cancel(): void{
    this.dialogRef.close();
  }

  signup(): void{
    this.authServices.login();
  }
}
