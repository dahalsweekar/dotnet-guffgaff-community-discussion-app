import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { PostServices } from '../../../services/post.services';
import { DialogBoxServices } from '../../../presets/dialog-box.component/dialog-box.services';
import { PageServices } from '../../../services/page.services';
import { AuthService } from '../../../auth/auth.services';
import { TimeAgoPipe } from '../../../services/time-ago/time-ago-pipe';
import { RefreshService } from '../../../services/refresh.services';

import { PostModel } from '../../../models/postVM';
import { VoteModel } from '../../../models/voteVM';
import { UserModel } from '../../../models/userVM';
import { MatDialog } from '@angular/material/dialog';
import { LoginBox } from '../../../auth/login-box/login-box';

import { LocalStorage } from '../../../services/localStorage.services';
import { SessionStorage } from '../../../services/sessionStorage.service';

@Component({
  selector: 'app-post',
  imports: [CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TimeAgoPipe,
  AngularEditorModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit{

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: '300px',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};

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
    Owner: '',
    Voter: '',
    PostId: '0',
    UpVote: true
  }

  currentPostId: string = '0';
  currentUser: UserModel = {
    Name: '',
    Password: '',
    Email: '',
    Picture: ''
  }

  isEditMode: string = '';

  constructor(private postServices: PostServices,
     private dialogServices: DialogBoxServices,
      private pageServices: PageServices,
       private router: Router,
        private authServices: AuthService,
         private localStorage: LocalStorage,
        private sessionStorage: SessionStorage,
        private dialog:MatDialog,
        private refreshServices: RefreshService){

  }

  ngOnInit(){
    
    this.currentUser.Email = this.localStorage.getSession('UserID');
    this.currentPostId = this.sessionStorage.getSession('PostID');
    this.isEditMode = this.sessionStorage.getSession('PostEditMode');
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
      if (!this.isEditMode){
        this.postServices.putPostfn(this.post).subscribe({
              next: (response) => {
                this.dialogServices.showValidation('Information', 'Post successful.')
                .afterClosed()
                .subscribe(() => {
                  this.sessionStorage.storeSession('PostID', response.Data.PostId);
                  this.pageServices.reloadComponent('discussion');
                })
              },
              error: (error) => {
                this.dialogServices.showError('Failed', 'Failed to save post.');
              }
            });
      }else{
        this.postServices.updatePostfn(this.post).subscribe({
          next:(response) => {
            this.dialogServices.showValidation('Information', 'Post updated')
            .afterClosed()
            .subscribe(() => {
              this.sessionStorage.deleteSession('PostEditMode');
              this.pageServices.reloadComponent('discussion');
            })
          },
          error: (error) => {
            this.dialogServices.showError('Failed', 'Failed to update post.');
          }
        });
      }
    }
  }

  updateVote(val: number): void{
    if (this.currentUser?.Email !== ''){
      this.vote.UpVote = val == 1 ? true: false;
      this.vote.Voter = this.currentUser?.Email;
      this.vote.PostId = this.currentPostId;
      this.postServices.updateVotefn(this.vote).subscribe({
        next: (response) => {
          this.dialogServices.showValidation('Success', response._message)
          .afterClosed()
          .subscribe(()=>{
            this.pageServices.reloadComponent('discussion');
          });
        },
        error: (error) => {
          this.dialogServices.showError('Failed', 'Unable to update vote');
        },
      });
    }
    else{
      const dialog = this.dialog.open(LoginBox, {
            width: '300px',
            height: '350px'
          });
          dialog.afterClosed().subscribe(() => {
              this.refreshServices.triggerRefreshB();
              this.pageServices.reloadComponent('discussion');
          });
    }
  }

  onEditClick(post: PostModel): void{
    this.sessionStorage.storeSession('PostEditMode', 'True');
    this.pageServices.reloadComponent('/discussion');
  }

  onDeleteClick(post: PostModel): void{
    this.dialogServices.showInfo('Confirmation', 'Do you really want to delete this post?', true)
    .afterClosed()
    .subscribe(confirmation => {
      if (confirmation === true){
        this.postServices.deletePostfn(post).subscribe({
          next:(response) => {
            this.dialogServices.showValidation('Success', 'Post deleted successfully.');
            this.pageServices.reloadComponent('discussion');
          },
          error: (error) => {
            this.dialogServices.showError('Failed', 'Unable to delete this post.');
          }
        });
      }else{

      }
    });
  }

  cancelEdit(): void{
    this.sessionStorage.deleteSession('PostEditMode');
    this.pageServices.reloadComponent('discussion');
  }
}
