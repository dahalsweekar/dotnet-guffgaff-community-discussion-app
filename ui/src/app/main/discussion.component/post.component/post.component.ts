import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PostServices } from '../../../services/post.services';
import { DialogBoxServices } from '../../../presets/dialog-box.component/dialog-box.services';
import { PageServices } from '../../../services/page.services';

import { PostModel } from '../../../models/postVM';
import { VoteModel } from '../../../models/voteVM';

@Component({
  selector: 'app-post',
  imports: [ CommonModule,
    FormsModule
   ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit{

  post: PostModel = {
    postId: 0,
    owner: '',
    title: '',
    description: '',
    category: ''
  }

  vote: VoteModel = {
    owner: '',
    voter: '',
    postId: '',
    upVote: true
  }

  currentPostId: number = 0;
  currentUserId: string = '';

  constructor(private postServices: PostServices, private dialogServices: DialogBoxServices, private pageServices: PageServices, private router: Router){

  }

  ngOnInit(){
    // set current postID through session or url params
  }

  setPost(): void{
    this.postServices.getPostfn(this.currentPostId).subscribe({
      next: (response) => {
        this.post = response;
      },
      error: (error) => {
        this.dialogServices.showError("Failed", "Could not load post.");
      }
    })
  }

  validatePost(): boolean{
    if(this.post.title !== ''){
      if(this.post.description !== ''){
        if (this.post.category !== ''){
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

  postThought(): void{
    if (this.validatePost()){
      this.postServices.putPostfn(this.post).subscribe({
      next: (response) => {
        this.dialogServices.showInfo('Information', 'Post successful.')
        .afterClosed()
        .subscribe(() => {
          this.pageServices.reloadComponent('post');
        })
      },
      error: (error) => {
        this.dialogServices.showError('Failed', 'Failed to save post.');
      }
    });
    }
  }

  updateVote(val: number): void{
    if (this.currentUserId !== ''){
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
