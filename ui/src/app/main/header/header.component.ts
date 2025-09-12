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
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.user = null;
  }
}
