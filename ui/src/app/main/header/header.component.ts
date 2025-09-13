import { Component, OnInit } from '@angular/core';

import { UserModel } from '../../models/userVM';

import { AuthService } from '../../auth/auth.services';
import { UserService } from '../../services/user.services';
import { DialogBoxServices } from '../../presets/dialog-box.component/dialog-box.services';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  isLoggedIn: boolean = false;
  user: UserModel | null = null;

  constructor(private authService: AuthService, private userService:UserService, private dialogService:DialogBoxServices) {}

  async ngOnInit(): Promise<void> {
    await this.authService.whenLoginProcessed;
    this.isLoggedIn = this.authService.isLoggedIn;
    if (this.isLoggedIn){
      this.checkUserExists();
    }
  }

  checkUserExists(): void{
    var claim = this.authService.identityClaims;
    this.user = {
      email: claim.email,
      name: claim.name,
      picture: claim.picture
    };

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
  }

  showUser(): void{
    var claims2 = this.authService.identityClaims;
    var token = this.authService.accessToken;
    var isLoggedIn = this.authService.isLoggedIn;
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.user = null;
  }
}
