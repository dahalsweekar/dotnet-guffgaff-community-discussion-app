import { Component, OnInit } from '@angular/core';
import { CommentModel } from '../../../models/commentVM';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CommentItemComponent } from '../comment-item/comment-item';

import { CommentServices } from '../../../services/comment.services';
import { DialogBoxServices } from '../../../presets/dialog-box.component/dialog-box.services';


@Component({
  selector: 'app-comments',
  imports: [FormsModule, CommonModule, CommentItemComponent],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentsComponent implements OnInit {

  postId: number = 0;
  userId: string = '';

  comments: CommentModel[] = [];
  nextId = 1;

  newCommentText = '';
  replyTextByComment: { [commentId: number]: string } = {};
  replyBoxOpenFor: Set<number> = new Set<number>();
  topLevelBoxOpen = false;

  flatComments: CommentModel[] = [
  { "postId":0,"userId":"","commentId": 1, "parentId": null, "commentDescription": "Top level 1" },
  { "postId":0,"userId":"","commentId": 2, "parentId": 1, "commentDescription": "Reply to 1" },
  { "postId":0,"userId":"","commentId": 3, "parentId": 2, "commentDescription": "Reply to reply" },
  { "postId":0,"userId":"","commentId": 4, "parentId": null, "commentDescription": "Top level 2" }
]

  constructor(private commentServices: CommentServices, private router: Router, private dialogServices: DialogBoxServices) { }

  ngOnInit(): void 
  {
    //this.comments = this.buildCommentTree(this.flatComments);
    this.initializeComments();
  }

  initializeComments(): void{
    this.commentServices.getCommentsfn(this.postId).subscribe({
        next: (response) => {
          this.flatComments = this.flattenComments(response[0], response[1])
          this.buildCommentTree(this.flatComments);
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
            commentMap.set(comment.commentId, comment);
          }

          // Update replies' parentId using the matched comment
          const updatedReplies: CommentModel[] = replies.map(reply => {
              const matchingComment = commentMap.get(reply.commentId);

              return {
                  ...reply,
                  parentId: matchingComment ? matchingComment.parentId : reply.parentId,
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


  openNewCommentBox(): void {
    this.topLevelBoxOpen = true;
    this.newCommentText = '';
  }

  saveNewComment(): void {
    const text = this.newCommentText.trim();
    if (!text) { return; }
    const comment: CommentModel = {
      postId: this.postId,
      userId: this.userId,
      commentId: this.nextId++,
      parentId: null,
      commentDescription: text,
      replies: []
    };
    this.commentServices.saveCommentfn(comment).subscribe({
      next: (response) => {
        if (response.IsSuccess){
          this.comments.push(comment);
          this.newCommentText = '';
          this.topLevelBoxOpen = false;
        }
      },
      error: (error) => {
        this.dialogServices.showError("Failed", "Could not add comment.");
        this.newCommentText = '';
        this.topLevelBoxOpen = false;
      }
    })
  }

  cancelNewComment(): void {
    this.topLevelBoxOpen = false;
    this.newCommentText = '';
  }

  openReplyBox(commentId: number): void {
    this.replyBoxOpenFor.add(commentId);
    this.replyTextByComment[commentId] = '';
  }

  cancelReply(commentId: number): void {
    this.replyBoxOpenFor.delete(commentId);
    delete this.replyTextByComment[commentId];
  }

  saveReply(parent: CommentModel): void {
    const text = (this.replyTextByComment[parent.commentId] || '').trim();
    if (!text) { return; }
    const reply: CommentModel = {
      postId: this.postId,
      userId: this.userId,
      commentId: this.nextId++,
      parentId: parent.commentId,
      commentDescription: text,
      replies: []
    };
    parent.replies?.push(reply);
    this.cancelReply(parent.commentId);
  }

  buildCommentTree(flatComments: CommentModel[]): CommentModel[] {
  const commentMap: { [key: number]: CommentModel } = {};
  const rootComments: CommentModel[] = [];

  // Step 1: Initialize map and empty replies array
  for (const comment of flatComments) {
    commentMap[comment.commentId] = { ...comment, replies: [] };
  }

  // Step 2: Populate tree
  for (const comment of flatComments) {
    if (comment.parentId === null) {
      rootComments.push(commentMap[comment.commentId]);
    } else {
      const parent = commentMap[comment.parentId];
      if (parent) {
        parent.replies?.push(commentMap[comment.commentId]);
      }
    }
  }

  return rootComments;
}
}
