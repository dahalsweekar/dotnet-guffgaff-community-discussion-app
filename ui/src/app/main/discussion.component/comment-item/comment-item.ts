import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommentModel } from '../../../models/commentVM';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { CommentServices } from '../../../services/comment.services';
import { LocalStorage } from '../../../services/localStorage.services';
import { DialogBoxServices } from '../../../presets/dialog-box.component/dialog-box.services';
import { TimeAgoPipe } from '../../../services/time-ago/time-ago-pipe';

import { VoteModel } from '../../../models/voteVM';

@Component({
  selector: 'app-comment-item',
    imports: [FormsModule, CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, TimeAgoPipe],
  templateUrl: './comment-item.html',
  styleUrls: ['./comment-item.scss']
})
export class CommentItemComponent {
  @Input() comment!: CommentModel;
  @Input() replyBoxOpenFor!: Set<number>;
  @Input() replyTextByComment!: { [id: number]: string };

  @Output() openReply = new EventEmitter<number>();
  @Output() cancelReply = new EventEmitter<number>();
  @Output() saveReply = new EventEmitter<CommentModel>();

  vote: VoteModel = {
      Owner: '',
      Voter: '',
      PostId: '0',
      UpVote: true
    }

  constructor(private commentServices: CommentServices, 
    private localStorage: LocalStorage, 
    private dialogServices:DialogBoxServices,
    private router: Router){}
  onReplyClick(): void {
    this.openReply.emit(this.comment.CommentId);
  }

  onCancelReply(): void {
    this.cancelReply.emit(this.comment.CommentId);
  }

  onSaveReply(): void {
    this.saveReply.emit(this.comment);
  }

  updateVote(val: number, commentId: number): void{
    if (this.localStorage.getSession('UserID') !== null){
      this.vote.UpVote = val == 1 ? true: false;
      this.vote.Owner = this.localStorage.getSession('UserID');
      this.vote.PostId = this.localStorage.getSession('PostID');
      this.vote.CommentId = commentId;
      this.commentServices.updateVoteCommentfn(this.vote).subscribe({
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
