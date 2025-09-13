import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/userVM';
import { AuthService } from '../../auth/auth.services';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent{

  isLoggedIn = false;
  user: UserModel | null = null;

  constructor(private authService: AuthService) {}

  login(): void {
    debugger;
    this.authService.login();
    var isLoggedIn = this.isLoggedIn;
  }

  showUser(): void{
    debugger;
    var claims = this.authService.getIdentity();
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
