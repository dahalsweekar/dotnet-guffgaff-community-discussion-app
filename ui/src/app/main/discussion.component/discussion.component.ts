import { Component, OnInit } from '@angular/core';
import { PostComponent } from './post/post.component';
import { CommentsComponent } from './comment/comment.component';
import { AiChatComponent } from "./ai-chat/ai-chat";
import { RefreshService } from '../../services/refresh.services';


@Component({
  selector: 'app-discussion',
  imports: [PostComponent, CommentsComponent, AiChatComponent],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.scss'
})
export class DiscussionComponent implements OnInit{

  constructor(private refreshService: RefreshService){

  }

  ngOnInit(): void {
    this.refreshService.triggerRefreshB();
  }
}
