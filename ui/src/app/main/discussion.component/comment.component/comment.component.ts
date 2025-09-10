import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CommentModel } from '../../../models/commentVM';

import { DialogBoxServices } from '../../../presets/dialog-box.component/dialog-box.services';

@Component({
  selector: 'app-comment',
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit{

  comment: CommentModel = {
    commentId: 0,
    postId: 0,
    commentThreadId: 0,
    userId: '',
    commentDescription: '',
    upvotes: 0,
    downvotes: 0
  }

  IsCommentAreaVisible: boolean = false;

  constructor(private dialogServices: DialogBoxServices){

  }

  ngOnInit(): void {
    
  }

  addComment(): void{
    this.IsCommentAreaVisible = true;
  }

  saveComment(): void{

  }

  cancelComment(): void{
    this.comment.commentDescription = '';
    this.IsCommentAreaVisible = false;
  }

}
