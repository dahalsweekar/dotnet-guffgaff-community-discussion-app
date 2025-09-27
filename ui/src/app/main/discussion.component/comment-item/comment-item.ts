import { Component, Input, Output, EventEmitter, OnInit, model } from '@angular/core';
import { CommentModel } from '../../../models/commentVM';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CommentServices } from '../../../services/comment.services';
import { LocalStorage } from '../../../services/localStorage.services';
import { DialogBoxServices } from '../../../presets/dialog-box.component/dialog-box.services';
import { TimeAgoPipe } from '../../../services/time-ago/time-ago-pipe';

import { VoteModel } from '../../../models/voteVM';

@Component({
  selector: 'app-comment-item',
    imports: [FormsModule, CommonModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, TimeAgoPipe],
  templateUrl: './comment-item.html',
  styleUrls: ['./comment-item.scss']
})
export class CommentItemComponent implements OnInit {
  @Input() comment!: CommentModel;
  @Input() replyBoxOpenFor!: Set<number>;
  @Input() replyTextByComment!: { [id: number]: string };

  @Output() openReply = new EventEmitter<CommentModel>();
  @Output() cancelReply = new EventEmitter<number>();
  @Output() saveReply = new EventEmitter<CommentModel>();
  @Output() openDelete = new EventEmitter<CommentModel>();

  vote: VoteModel = {
      Owner: '',
      Voter: '',
      PostId: '0',
      UpVote: true
    }
  
  currentUser: string = ''
  currentPostID: string = ''
  
  constructor(private commentServices: CommentServices, 
    private localStorage: LocalStorage, 
    private dialogServices:DialogBoxServices,
    private router: Router){}

  ngOnInit(): void {
    this.currentUser = this.localStorage.getSession('UserID');
    this.currentPostID = this.localStorage.getSession('PostID');
  }

  onReplyClick(Mode: string): void {
    if(Mode == 'EditMode')
      this.comment.localIsEditing = true;
    else
      this.comment.localIsEditing = false;
    this.openReply.emit(this.comment);
  }

  onCancelReply(): void {
    this.cancelReply.emit(this.comment.CommentId);
  }

  onSaveReply(): void {
    this.saveReply.emit(this.comment);
  }

  updateVote(val: number, commentId: number): void{
    if (this.currentUser !== ''){
      this.vote.UpVote = val == 1 ? true: false;
      this.vote.Owner = this.currentUser;
      this.vote.PostId = this.currentPostID;
      this.vote.CommentId = commentId;
      this.commentServices.updateVoteCommentfn(this.vote).subscribe({
        next: (response) => {
          this.dialogServices.showValidation('Success', 'Vote successful.');
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

  onDeleteClick(): void{
    this.openDelete.emit(this.comment);
  }
}
