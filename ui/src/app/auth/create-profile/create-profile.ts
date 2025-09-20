import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { LocalStorage } from '../../services/localStorage.services';
import { UserModel } from '../../models/userVM';
import { AuthService } from '../auth.services';
import { UserService } from '../../services/user.services';
import { DialogBoxServices } from '../../presets/dialog-box.component/dialog-box.services';

@Component({
  selector: 'app-create-profile',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './create-profile.html',
  styleUrl: './create-profile.scss'
})
export class CreateProfile implements OnInit{

  user: UserModel = {
    Name: '',
    Password: '',
    Email: '',
    Picture: ''
   }

  ConfirmPassword: string = '';

  userExists: boolean = true;

  constructor(private authServices: AuthService, 
    private dialogServices: DialogBoxServices, 
    private router: Router, 
    private userService:UserService, 
    private localStorage: LocalStorage,
    private cdr: ChangeDetectorRef){

  }

  async ngOnInit(): Promise<void> {
    await this.authServices.whenLoginProcessed;
    if (this.authServices.isLoggedIn){
      this.getUser();
    }
  }

  getUser(): void{
    this.user = this.authServices.user ?? {
    Name: '',
    Password: '',
    Email: '',
    Picture: ''
   };
    this.user.Password = '';
    this.cdr.detectChanges();
    this.userCheck();
  }
  
  validateUserEmail(): boolean{
    if (this.user.Name !== ''){
      if (this.user.Password !== ''){
        if (this.ConfirmPassword !== ''){
          if (this.user.Password === this.ConfirmPassword){
            return true;
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
    return false;
  }

  userCheck(): void{
     this.authServices.validateUserfn(this.user).subscribe({
      next: (response) => {
        if (response._message === 'Nein'){
          this.userExists = false;
          this.authServices.logout();
        }
        else
        {
          this.dialogServices.showValidation('Validation', 'User already exist. Please try to login with username and password.')
          .afterClosed()
          .subscribe(() => {
            this.authServices.logout();
            this.router.navigateByUrl('/feed');
          });
        }
      },
      error: (error) => {
        this.dialogServices.showError("Failed", 'Unable to validate user.');
      }
    });
  }

  create(): void{
    if (this.validateUserEmail() && !this.userExists){
      this.userService.saveUserCredentialsfn(this.user).subscribe({
        next: (response) => {
          this.dialogServices.showInfo("Success", "Your profile has been created.")
          .afterClosed()
          .subscribe(() => {
            this.authServices.localLoginfn(this.user).subscribe({
              next: (response) => {
                this.dialogServices.showInfo('Success', 'You are logged in.')
                .afterClosed()
                .subscribe(() => {
                  this.localStorage.storeSession('UserID', this.user.Email);
                  this.localStorage.storeSession('Token', response.Token);
                  this.router.navigateByUrl('/feed');
                })
              },
              error: (error) => {
                this.dialogServices.showError('Error', 'There was problem while loggin in.');
              }
            });
          });
        },
        error: (error) => {
          this.dialogServices.showError("Failed", 'Cannot create new user.');
        }
      })
    }
  }

  cancel(): void{
    this.authServices.logout();
    this.router.navigateByUrl('/feed');
  }
}
