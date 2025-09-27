import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
export class HeaderComponent implements OnInit, OnDestroy{

  private subscriber!: Subscription
  isLoggedIn: boolean = false;
  user: UserModel | null = null;

  constructor(
    private authService: AuthService, 
    private userService:UserService, 
    private dialogService:DialogBoxServices, 
    private pageServices: PageServices,
    private dialog: MatDialog,
    private localStorage: LocalStorage,
    private router: Router
   ) {}

  async ngOnInit(): Promise<void> {
    this.refreshHeader();
  }

  refreshHeader() {
    console.log('Header is being refreshed!');
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
      width: '300px',
      height: '350px'
    });
    dialog.afterClosed().subscribe(() => {
        this.refreshHeader();
        this.pageServices.reloadComponent('/feed');
    });
  }

  logout(): void {
    this.dialogService.showValidation("Success", "You are logged out.")
    .afterClosed()
    .subscribe(() =>{
      this.localStorage.deleteAllSession(['Token', 'UserDetails', 'UserID', 'PostID', 'PostEditMode']);
      this.refreshHeader();
      this.pageServices.reloadComponent('/feed');
    })
  }

  redirectToHome(): void{
    this.router.navigateByUrl('/feed');
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }
}
