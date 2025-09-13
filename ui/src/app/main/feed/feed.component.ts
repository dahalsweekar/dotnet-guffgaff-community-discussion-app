import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { PostModel } from '../../models/postVM';
import { UserModel } from '../../models/userVM';

import { AuthService } from '../../auth/auth.services';

@Component({
  selector: 'app-feed.component',
  imports: [MatButtonModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {
  
    loggedInUser: UserModel = {
      userId: '',
      name: '',
      email: ''
    }

    feedModel : PostModel   =  {
      postId: 0,
      owner: '',
      title: '',
      description: '',
      upvotes: 0,
      downvotes: 0,
      comments: 0
    };

    feedList: PostModel[] = [];

    constructor(private router: Router, private authService: AuthService){}

    ngOnInit(): void {
      
    }

    checkUserLogin(): void{
      if (!this.authService.isLoggedIn){
         this.authService.login();
      }
      else
      {
        this.redirectToPost(0);
      }
    }

    redirectToPost(postId: number): void{
      this.router.navigateByUrl('/discussion');
    }

    redirectToLogin(): void{
      this.router.navigateByUrl('/oauth');
    }
}
