import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserModel } from '../../models/userVM';

import { LocalStorage } from '../../services/localStorage.services';
import { AuthService } from '../../auth/auth.services';
import { UserService } from '../../services/user.services';
import { DialogBoxServices } from '../../presets/dialog-box.component/dialog-box.services';
import { PageServices } from '../../services/page.services';

import { MatButtonModule } from '@angular/material/button';
import { LoginBox } from '../../auth/login-box/login-box';

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
    private pageServices: PageServices,
    private dialog: MatDialog,
    private localStorage: LocalStorage,
    private router: Router) {}

  async ngOnInit(): Promise<void> {
    
    const token = this.localStorage.getSession('Token');
    this.isLoggedIn = !!token;
    if (this.isLoggedIn){
      var userDetailsJson = this.localStorage.getSession('UserDetails');
      if (userDetailsJson !== ""){
        this.user = JSON.parse(userDetailsJson);
        this.localStorage.storeSession('UserID', this.user?.Email ?? "")
      }
      else{
        this.user = null;
      }
    }
  }

  login(): void {
    const dialog = this.dialog.open(LoginBox, {
      width: '350px',
      height: '400px'
    });
    dialog.afterClosed().subscribe(() => {
        this.pageServices.reloadComponent('/feed');
    });
  }

  logout(): void {
    this.dialogService.showInfo("Success", "You are logged out.")
    .afterClosed()
    .subscribe(() =>{
      this.localStorage.deleteAllSession(['Token', 'UserDetails', 'PostID']);
      this.pageServices.reloadComponent('/feed');
    })
  }

  redirectToHome(): void{
    this.router.navigateByUrl('/feed');
  }
}
