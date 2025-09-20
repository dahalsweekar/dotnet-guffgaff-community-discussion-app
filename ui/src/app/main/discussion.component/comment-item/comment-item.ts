import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommentModel } from '../../../models/commentVM';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { PostServices } from '../../../services/post.services';
import { LocalStorage } from '../../../services/localStorage.services';
import { DialogBoxServices } from '../../../presets/dialog-box.component/dialog-box.services';

import { VoteModel } from '../../../models/voteVM';

@Component({
  selector: 'app-comment-item',
    imports: [FormsModule, CommonModule, MatIconModule],
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
      owner: '',
      voter: '',
      postId: 0,
      upVote: true
    }

  constructor(private postServices: PostServices, 
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

  updateVote(val: number): void{
    if (this.localStorage.getSession('UserID') !== null){
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
