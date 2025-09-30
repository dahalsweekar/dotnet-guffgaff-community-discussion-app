import { Component, OnInit } from '@angular/core';
import { CommentModel } from '../../../models/commentVM';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CommentItemComponent } from '../comment-item/comment-item';
import { LoginBox } from '../../../auth/login-box/login-box';

import { CommentServices } from '../../../services/comment.services';
import { DialogBoxServices } from '../../../presets/dialog-box.component/dialog-box.services';
import { LocalStorage } from '../../../services/localStorage.services';
import { SessionStorage } from '../../../services/sessionStorage.service';
import { PageServices } from '../../../services/page.services';
import { RefreshService } from '../../../services/refresh.services';


@Component({
  selector: 'app-comments',
  imports: [FormsModule, CommonModule, CommentItemComponent, MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentsComponent implements OnInit {

  postId: string = '0';
  userId: string = '';

  comments: CommentModel[] = [];
  nextId: number = 0;

  newCommentText = '';
  editCommentId: number = 0;
  replyTextByComment: { [commentId: number]: string } = {};
  replyBoxOpenFor: Set<number> = new Set<number>();
  topLevelBoxOpen = false;

  IsCommentVisible: boolean = false;

  flatComments: CommentModel[] = [];
  isEditMode: boolean = false;

  constructor(private commentServices: CommentServices,
     private router: Router,
      private dialogServices: DialogBoxServices,
       private localStorage: LocalStorage,
       private sessionStorage: SessionStorage,
        private pageServices: PageServices,
        private refreshServices: RefreshService,
        private dialog: MatDialog) { }

  ngOnInit(): void 
  {
    this.userId = this.localStorage.getSession('UserID');
    this.postId = this.sessionStorage.getSession('PostID');
    if (this.postId !== '0'){
      this.IsCommentVisible = true;
    }
    this.initializeComments();
  }

  setNextID(): void{
    for(var comment of this.flatComments){
      if (comment.CommentId > this.nextId){
        this.nextId = comment.CommentId;
      }
    }
    this.nextId++;
  }

  initializeComments(): void{
    const PostId = {'PostId': this.postId}
    this.commentServices.getCommentsfn(PostId).subscribe({
        next: (response) => {
          this.flatComments = this.flattenComments(response.Data.comments, response.Data.replies)
          this.comments = this.buildCommentTree(this.flatComments);
        },
        error: (error) => {
          this.dialogServices.showError("Failed", "Could not initialize comments.");
        }
    });
  }

  flattenComments(
    comments: CommentModel[],
    replies: CommentModel[]
    ): CommentModel[] {
          const commentMap = new Map<number, CommentModel>();

          // Map comments by commentId
          for (const comment of comments) {
            commentMap.set(comment.CommentId, comment);
          }

          // Update replies' parentId using the matched comment
          const updatedReplies: CommentModel[] = replies.map(reply => {
              const matchingComment = commentMap.get(reply.CommentId);

              return {
                  ...reply,
                  ParentId: matchingComment ? matchingComment.ParentId : reply.ParentId,
                  replies: undefined // remove nested replies if flattening
              };
          });

          // Optionally remove `replies` from original comments as well
          const flattenedComments = comments.map(comment => ({
              ...comment,
              replies: undefined
          }));

          return [...flattenedComments, ...updatedReplies];
      }


  openNewCommentBox(commentText: string, commentId: number): void {
    if (this.userId !== ''){
      this.topLevelBoxOpen = true;
      this.newCommentText = commentText;
      this.editCommentId = commentId;
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

  saveNewComment(): void {
    const text = this.newCommentText.trim();
    if (!text) { return; }
      this.setNextID();
      const comment: CommentModel = {
        PostId: this.postId,
        UserId: this.userId,
        CommentId: this.nextId,
        ParentId: null,
        UpVotes: 0,
        DownVotes: 0,
        CommentDescription: text,
        Replies: []
      };
      this.commentServices.saveCommentfn(comment).subscribe({
        next: (response) => {
          if (response._isSuccess){
            this.pageServices.reloadComponent('discussion');
          }
        },
        error: (error) => {
          this.dialogServices.showError("Failed", "Could not add comment.");
          this.newCommentText = '';
          this.topLevelBoxOpen = false;
        }
      });
    this.cancelNewComment();
  }

  cancelNewComment(): void {
    this.topLevelBoxOpen = false;
    this.newCommentText = '';
  }

  openReplyBox(comment: CommentModel): void {
    this.replyBoxOpenFor.add(comment.CommentId);
    this.replyTextByComment[comment.CommentId] = '';
  }

  cancelReply(commentId: number): void {
    this.replyBoxOpenFor.delete(commentId);
    delete this.replyTextByComment[commentId];
  }

  saveReply(parent: CommentModel): void {
    const text = (this.replyTextByComment[parent.CommentId] || '').trim();
    if (!text) { return; }
    if (!parent.localIsEditing){
      this.setNextID();
      const reply: CommentModel = {
        PostId: this.postId,
        UserId: this.userId,
        CommentId: this.nextId,
        ParentId: parent.CommentId,
        CommentDescription: text,
        Replies: []
      };
      this.commentServices.saveReplyfn(reply).subscribe({
        next: (response) => {
          this.pageServices.reloadComponent('discussion');
        },
        error: (error) => {
          this.dialogServices.showError('Failed', 'Unable to save reply.');
        }
      });
    }
    else{
      const reply: CommentModel = {
        PostId: this.postId,
        UserId: this.userId,
        CommentId: parent.CommentId,
        ParentId: parent.CommentId,
        CommentDescription: text,
        Replies: []
      };
      this.commentServices.updateCommentfn(reply).subscribe({
        next: (response) => {
          this.pageServices.reloadComponent('discussion');
        },
        error: (error) => {
          this.dialogServices.showError('Failed', 'Unable to update comment');
        }
      });
    }
    this.cancelReply(parent.CommentId);
  }

  editComment(parent: CommentModel): void{
    this.isEditMode = true;
    this.openNewCommentBox(parent.CommentDescription, parent.CommentId);
  }

  deleteComment(parent: CommentModel): void{
    this.dialogServices.showInfo('Confirmation', 'Do you really want to delete this comment?', true)
    .afterClosed()
    .subscribe(confirmation => {
      if (confirmation === true){
          const comment: CommentModel = {
          PostId: this.postId,
          UserId: this.userId,
          CommentId: parent.CommentId,
          ParentId: parent.CommentId,
          CommentDescription: parent.CommentDescription,
          Replies: []
        };
        this.commentServices.deleteCommentfn(comment).subscribe({
          next: (response) => {
            this.dialogServices.showValidation('Success', 'Comment removed.')
            .afterClosed()
            .subscribe(() => {
              this.pageServices.reloadComponent('discussion');
            });
          },
          error: (error) => {
            this.dialogServices.showError('Failed', 'Could not remove this comment');
          }
        });
      }
      else{

      }
    });
  }

  buildCommentTree(flatComments: CommentModel[]): CommentModel[] {
  const commentMap: { [key: number]: CommentModel } = {};
  const rootComments: CommentModel[] = [];

  // Step 1: Initialize map and empty replies array
  for (const comment of flatComments) {
    commentMap[comment.CommentId] = { ...comment, Replies: [] };
  }

  // Step 2: Populate tree
  for (const comment of flatComments) {
    if (comment.ParentId === null) {
      rootComments.push(commentMap[comment.CommentId]);
    } else {
      const parent = commentMap[comment.ParentId];
      if (parent) {
        parent.Replies?.push(commentMap[comment.CommentId]);
      }
    }
  }

  return rootComments;
}
}
