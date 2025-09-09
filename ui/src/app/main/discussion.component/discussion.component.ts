import { Component } from '@angular/core';
import { PostComponent } from "./post.component/post.component";
import { CommentComponent } from "./comment.component/comment.component";

import { provideHttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-discussion',
  imports: [PostComponent, CommentComponent],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.scss'
})
export class DiscussionComponent {

}
