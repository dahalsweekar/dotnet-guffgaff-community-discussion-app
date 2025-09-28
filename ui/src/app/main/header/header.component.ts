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
import { RefreshService } from '../../services/refresh.services';

import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { LoginBox } from '../../auth/login-box/login-box';
import { NotificationModel } from '../../models/notificationVM';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy{

  private subscriber!: Subscription
  isLoggedIn: boolean = false;
  user: UserModel | null = null;
  notificationCount: number = 0;
  notificationList: NotificationModel[] = [];

  constructor(
    private authService: AuthService, 
    private userService:UserService, 
    private dialogService:DialogBoxServices, 
    private pageServices: PageServices,
    private dialog: MatDialog,
    private localStorage: LocalStorage,
    private router: Router,
    private refreshService: RefreshService,
   ) {}

  async ngOnInit(): Promise<void> {
    this.subscriber = this.refreshService.refreshB$.subscribe(() => {
      this.refresh();
    });
  }

  refresh() {
    console.log('Header is being refreshed!');
    const token = this.localStorage.getSession('Token');
    this.isLoggedIn = !!token;
    if (this.isLoggedIn){
      var userDetailsJson = this.localStorage.getSession('UserDetails');
      if (userDetailsJson !== ""){
        this.user = JSON.parse(userDetailsJson);
        this.localStorage.storeSession('UserID', this.user?.Email ?? "")
        this.checkNotification();
      }
      else{
        this.user = null;
      }
    }
  }

  checkNotification(){
      this.userService.checkNotificationsfn(this.user).subscribe({
        next:(response) => {
          this.notificationList = response.Data;
          this.notificationCount = this.notificationList.length;
        },
        error:(error) => {
          this.dialogService.showError('Error', error._message);
        }
      })
  }

  goToNotification(notice: NotificationModel): void{
    this.userService.updateNotificationStatusfn(notice).subscribe({
      next: (response) => {
        this.localStorage.storeSession('PostID', notice.ActionPostId);
        this.router.navigateByUrl('/discussion');  
      },
      error: (error) => {
        this.dialogService.showError('Failed', 'Unable to navigate to the post.');
      }
    })
  }

  login(): void {
    const dialog = this.dialog.open(LoginBox, {
      width: '300px',
      height: '350px'
    });
    dialog.afterClosed().subscribe(() => {
        this.refresh();
        this.pageServices.reloadComponent('/feed');
    });
  }

  logout(): void {
    this.dialogService.showValidation("Success", "You are logged out.")
    .afterClosed()
    .subscribe(() =>{
      this.localStorage.deleteAllSession(['Token', 'UserDetails', 'UserID', 'PostID', 'PostEditMode']);
      this.refresh();
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
