import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MatDialogRef } from '@angular/material/dialog';

import { UserModel } from '../../models/userVM';
import { AuthService } from '../auth.services';
import { DialogBoxServices } from '../../presets/dialog-box.component/dialog-box.services';

@Component({
  selector: 'app-create-profile',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './create-profile.html',
  styleUrl: './create-profile.scss'
})
export class CreateProfile implements OnInit{

  user: UserModel = {}
  ConfirmPassword: string = '';

  userExists: boolean = true;

  constructor(private authServices: AuthService, private dialogServices: DialogBoxServices, private dialogRef: MatDialogRef<CreateProfile>){

  }

  ngOnInit(): void {
    this.userCheck();
  }
  
  validateUserEmail(): void{
    if (this.user.Name !== ''){
      if (this.user.Password !== ''){
        if (this.ConfirmPassword !== ''){
          if (this.user.Password === this.ConfirmPassword){
             
          } else{
            this.dialogServices.showValidation('Validation', 'Password does not match.');
          }
        }else{
          this.dialogServices.showValidation('Validation', 'Please Confim Password.');
        }
      } else{
        this.dialogServices.showValidation('Validation', 'Please enter a Password.');
      }
    } else{
      this.dialogServices.showValidation('Validation', 'Please enter a name.');
    }
  }

  userCheck(): void{
     this.authServices.validateUserfn(this.user).subscribe({
      next: (response) => {
        if (response.message.ToLower() === 'nein'){
          this.userExists = false;
        }
        else
        {
          this.dialogServices.showValidation('Validation', 'User already exist. Please try to login with username and password.')
          .afterClosed()
          .subscribe(() => {
            this.dialogRef.close();
          });
        }
      },
      error: (error) => {
        this.dialogServices.showError("Failed", 'Unable to validate user.');
      }
    });
  }

  create(): void{
    if (!this.userExists){

    }
  }

  cancel(): void{
    this.dialogRef.close();
  }
}
