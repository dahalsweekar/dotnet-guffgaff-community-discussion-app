import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PostModel } from '../../models/postVM';
import { UserModel } from '../../models/userVM';
import { LoginBox } from '../../auth/login-box/login-box';
import { AuthService } from '../../auth/auth.services';
import { LocalStorage } from '../../services/localStorage.services';
import { FeedServices } from '../../services/feed.services';
import { DialogBoxServices } from '../../presets/dialog-box.component/dialog-box.services';
import { Search } from "../search/search";
import { MatIconModule } from '@angular/material/icon';
import { TimeAgoPipe } from '../../services/time-ago/time-ago-pipe';
import { RefreshService } from '../../services/refresh.services';

@Component({
  selector: 'app-feed.component',
  imports: [MatButtonModule, Search, MatIconModule, TimeAgoPipe],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {
  
    loggedInUser: UserModel = {
      Name: '',
      Email: '',
      Picture: '',
      Password: ''
    }

    feedModel : PostModel   =  {
      PostId: '0',
      Owner: '',
      Title: '',
      Description: '',
      UpVotes: 0,
      DownVotes: 0,
      Comments: 0
    };

    feedList: PostModel[] = [];
    trendingPosts: PostModel[] =[];
    popularPosts: PostModel[] = [];
    categories: string[] = [];

    selectedCategory: string | null = null;

    constructor(
      private router: Router, 
      private authService: AuthService, 
      private localStorage: LocalStorage, 
      private feedServices:FeedServices,
      private dialog: MatDialog,
      private dialogServices: DialogBoxServices,
      private refreshService: RefreshService){}

    ngOnInit(): void {
      this.refreshService.triggerRefreshB();
      this.getSavedPosts();
      //this.getTrendingPosts();
      //this.getCategories();
    }

    getTrendingPosts(): void{
      this.feedServices.getTrendingPostsfn().subscribe({
        next: (response) => {
          this.trendingPosts = response[0].Data;
          this.popularPosts = response[1].Data;
        },
        error: (error) => {
          this.dialogServices.showError('Failed', 'Unable to fetch trending posts.');
        }
      });
    }

    getCategories(): void{
      this.feedServices.getCategoriesfn().subscribe({
        next: (response) => {
          this.categories = response.Data;
        },
        error: (error) => {
          this.dialogServices.showError('Failed', 'Unable to fetch categories.');
        }
      });
    }

    getSavedPosts(): void{
      this.feedServices.getSavedPostsfn().subscribe({
        next: (response) =>{
          this.feedList = response.Data;
        },
        error: (error) =>{
          this.dialogServices.showError("Failed", "Could not fetch posts.");
        }
      })
    }

    checkUserLogin(): void{
      const token = this.localStorage.getSession('Token');
      if (!!token){
         this.redirectToPost('0');
      }
      else
      {
        this.dialog.open(LoginBox, {
              width: '350px',
              height: '400px'
            });
      }
    }

    redirectToPost(postId: string): void{
      this.localStorage.storeSession('PostID', postId.toString());
      this.router.navigateByUrl('/discussion');
    }

    redirectToLogin(): void{
      this.authService.login();
    }

    // onCategorySelected(category: string) {
      
    //   this.selectedCategory = category;

    //   // Reorder feedList: selected category first, others later
    //   this.feedList = [
    //     ...this.feedList.filter(post => post.Category === category),
    //     ...this.feedList.filter(post => post.Category !== category)
    //   ];
    // }
}
