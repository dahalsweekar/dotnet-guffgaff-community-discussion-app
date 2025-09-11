import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommentModel } from '../../../models/commentVM';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-item',
    imports: [FormsModule, CommonModule],
  templateUrl: './comment-item.html',
  styleUrls: ['./comment-item.scss']
})
export class CommentItemComponent {
  @Input() comment!: CommentModel;
  @Input() replyBoxOpenFor!: Set<number>;
  @Input() replyTextByComment!: { [id: number]: string };

  @Output() openReply = new EventEmitter<number>();
  @Output() cancelReply = new EventEmitter<number>();
  @Output() saveReply = new EventEmitter<CommentModel>(); // emit parent

  onReplyClick(): void {
    this.openReply.emit(this.comment.commentId);
  }

  onCancelReply(): void {
    this.cancelReply.emit(this.comment.commentId);
  }

  onSaveReply(): void {
    this.saveReply.emit(this.comment);
  }
}
