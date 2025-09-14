import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { UserModel } from '../../models/userVM';

import { AuthService } from '../../auth/auth.services';
import { UserService } from '../../services/user.services';
import { DialogBoxServices } from '../../presets/dialog-box.component/dialog-box.services';
import { PageServices } from '../../services/page.services';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  isLoggedIn: boolean = false;
  user: UserModel | null = null;

  constructor(
    private authService: AuthService, 
    private userService:UserService, 
    private dialogService:DialogBoxServices, 
    private cdr: ChangeDetectorRef,
    private pageServices: PageServices) {}

  async ngOnInit(): Promise<void> {
    await this.authService.whenLoginProcessed;
    this.isLoggedIn = this.authService.isLoggedIn;
    if (this.isLoggedIn){
      this.checkUserExists();
    }
  }

  checkUserExists(): void{
    this.user = this.authService.user;
    this.cdr.detectChanges();
    this.userService.saveUserCredentialsfn(this.user).subscribe({
      next:(response) => {
 
      },
      error: (error) => {
        this.dialogService.showError("Failed", "Could not save user details. This may be resolved later.");
      }
    })
  }

  login(): void {
    this.authService.login();
    this.dialogService.showInfo("Success", "You are logged in.");
  }

  logout(): void {
    this.authService.logout();
    this.dialogService.showInfo("Success", "You are logged out.")
    .afterClosed()
    .subscribe(() =>{
      this.pageServices.reloadComponent('feed');
    })
  }
}
