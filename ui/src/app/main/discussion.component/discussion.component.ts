import { Component } from '@angular/core';
import { PostComponent } from './post/post.component';
import { CommentsComponent } from './comment/comment.component';


@Component({
  selector: 'app-discussion',
  imports: [PostComponent, CommentsComponent],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.scss'
})
export class DiscussionComponent {

}
