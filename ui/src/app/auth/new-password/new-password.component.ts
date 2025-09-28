import { Component, OnInit } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.services';
import { MatIconModule } from '@angular/material/icon';

import { MatDialogModule } from '@angular/material/dialog';
import { DialogBoxServices } from '../../presets/dialog-box.component/dialog-box.services';

@Component({
  selector: 'app-new-password',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss',
})
export class NewPasswordComponent implements OnInit {
  countDown: string = '';
  newpassword: string = '';
  confirmpassword: string = '';

  passwordDetails: any = {
    UserId: '',
    Password: '',
  };

  globalToken: string = ''

  constructor(
    private router: Router,
    private userServices: UserService,
    private dialogServices: DialogBoxServices,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    this.globalToken = token?.toString() ?? '';
    this.getUserIDfromToken();
  }

  getUserIDfromToken(): void{
    this.userServices.getUserIDfromTokenfn(this.globalToken).subscribe({
      next: (response) => {
        debugger;
        this.passwordDetails.Email = response;
      },
      error: (error) => {
        this.dialogServices.showError('Failed', 'There was an error while trying to get credentials.');
      }
    })
  }

  saveNewPassword() {
    this.userServices
      .saveNewPasswordfn(this.passwordDetails)
      .subscribe({
        next: (response) => {
          const resp: any = response;
          this.dialogServices
            .showInfo('Success', resp._message)
            .afterClosed()
            .subscribe(() => {
              this.userServices.deleteTokensfn({Email: this.passwordDetails.Email, TokenNo: this.globalToken}).subscribe({
                next: (response) => {
                  this.dialogServices.showValidation('Success', 'Password changed.')
                  .afterClosed()
                  .subscribe(() => {
                     this.router.navigateByUrl('/feed');
                  });
                },
                error: (error) => {
                  this.dialogServices.showError('Error', 'Unable to clear session token.');
                } 
              });
            });
        },
        error: (error) => {
          this.dialogServices.showError('Error', 'Unable to change password');
        },
      });
  }

  validatePasswords() {
    if (this.newpassword != '' && this.confirmpassword != '') {
      if (this.newpassword == this.confirmpassword) {
        this.passwordDetails.Password = this.newpassword;
        this.saveNewPassword();
      } else {
        this.dialogServices.showValidation(
          'Validation',
          'Passwords does not match'
        );
      }
    } else {
      this.dialogServices.showValidation(
        'Validation',
        'Fields cannot be empty'
      );
    }
  }

  onCancelClick() {
    this.router.navigateByUrl('/feed');
  }
}
