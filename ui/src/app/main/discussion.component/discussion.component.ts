import { Component } from '@angular/core';
import { PostComponent } from './post/post.component';
import { CommentsComponent } from './comment/comment.component';
import { Search } from '../search/search';
import { AiChatComponent } from "./ai-chat/ai-chat";


@Component({
  selector: 'app-discussion',
  imports: [PostComponent, CommentsComponent, Search, AiChatComponent],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.scss'
})
export class DiscussionComponent {

}
