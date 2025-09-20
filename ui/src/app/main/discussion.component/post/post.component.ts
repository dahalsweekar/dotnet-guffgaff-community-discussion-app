import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PostServices } from '../../../services/post.services';
import { DialogBoxServices } from '../../../presets/dialog-box.component/dialog-box.services';
import { PageServices } from '../../../services/page.services';
import { AuthService } from '../../../auth/auth.services';
import { HighlightPipe } from '../../../services/highlight/highlight-pipe';

import { PostModel } from '../../../models/postVM';
import { VoteModel } from '../../../models/voteVM';
import { UserModel } from '../../../models/userVM';

import { LocalStorage } from '../../../services/localStorage.services';
import { Search } from "../../search/search";
import { CommentsComponent } from "../comment/comment.component";

@Component({
  selector: 'app-post',
  imports: [CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    Search],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit{

  post: PostModel = {
    Owner: '',
    Title: '',
    Description: '',
    Category: '',
    UpVotes: 0,
    DownVotes: 0,
    Comments: 0
  }

  vote: VoteModel = {
    owner: '',
    voter: '',
    postId: 0,
    upVote: true
  }

  currentPostId: string = '0';
  currentUser: UserModel = {
    Name: '',
    Password: '',
    Email: '',
    Picture: ''
  }

  constructor(private postServices: PostServices,
     private dialogServices: DialogBoxServices,
      private pageServices: PageServices,
       private router: Router,
        private authServices: AuthService,
         private localStorage: LocalStorage){

  }

  ngOnInit(){
    this.currentUser.Email = this.localStorage.getSession('UserID');
    this.currentPostId = this.localStorage.getSession('PostID');
    if (this.currentPostId !== '0')
      this.setPost();
  }

  setPost(): void{
    var PostId = {'PostId': this.currentPostId}
    this.postServices.getPostfn(PostId).subscribe({
      next: (response) => {
        this.post = response.Data;
      },
      error: (error) => {
        this.dialogServices.showError("Failed", "Could not load post.");
      }
    });
  }

  validatePost(): boolean{
    if(this.post.Title !== ''){
      if(this.post.Description !== ''){
        if (this.post.Category !== ''){
          return true;
        }
        else{
          this.dialogServices.showValidation("Validation", "Please enter a category.");
          return false;
        }
      }else{
        this.dialogServices.showValidation("Validation", "Please enter description.");
        return false;
      }
    }else{
      this.dialogServices.showValidation("Validation", "Please enter title.");
      return false;
    }
  }

  putPost(): void{
    if (this.validatePost()){
      this.post.Owner = this.currentUser?.Email ?? '';
      this.postServices.putPostfn(this.post).subscribe({
      next: (response) => {
        this.dialogServices.showInfo('Information', 'Post successful.')
        .afterClosed()
        .subscribe(() => {
          debugger;
          this.localStorage.storeSession('PostID', response.Data.PostId);
          this.pageServices.reloadComponent('discussion');
        })
      },
      error: (error) => {
        this.dialogServices.showError('Failed', 'Failed to save post.');
      }
    });
    }
  }

  updateVote(val: number): void{
    if (this.currentUser !== null){
      this.vote.upVote = val == 1 ? true: false;
      this.postServices.updateVotefn(this.vote).subscribe({
        next: (response) => {
          this.dialogServices.showInfo('Success', 'Vote successful.');
        },
        error: (error) => {
          this.dialogServices.showError('Failed', 'Unable to update vote');
        },
      });
    }
    else{
      this.router.navigateByUrl('/oauth');
    }
  }
}
