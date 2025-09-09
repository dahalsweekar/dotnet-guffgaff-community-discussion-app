import { Routes } from '@angular/router';
import { PostComponent } from './main/discussion.component/post.component/post.component';
import { DiscussionComponent } from './main/discussion.component/discussion.component';
import { FeedComponent } from './main/feed.component/feed.component';
import { CommentComponent } from './main/discussion.component/comment.component/comment.component';

export const routes: Routes = [
    {path: 'feed', component: FeedComponent},
    {path: 'discussion', component: DiscussionComponent},
    {path: '', redirectTo: 'feed', pathMatch: 'full' }
];
